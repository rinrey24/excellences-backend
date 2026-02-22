import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, type DeepPartial } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Claim } from './entities/claim.entity';
import { ImportJob } from './entities/import.entity';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { Overstay } from 'src/overstays/entities/overstay.entity';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { DiagnoseTransaction } from './entities/diagnose-transaction.entity';
import { ProceduresTransaction } from './entities/procedures-transaction.entity';
import { ClaimRuleResult } from './entities/claim-rule-result.entity';
import { RuleEngineService } from 'src/rule-engine/rule-engine.service';

@Injectable()
export class ClaimsService {
  private readonly logger = new Logger(ClaimsService.name);

  constructor(
    @InjectRepository(Claim)
    private readonly claimRepo: Repository<Claim>,
    @InjectRepository(ImportJob)
    private readonly importJobRepo: Repository<ImportJob>,
    @InjectQueue('claims-import')
    private claimsQueue: Queue,
    @InjectRepository(Overstay)
    private readonly overStayRepo: Repository<Overstay>,
    @InjectRepository(DiagnoseTransaction)
    private readonly diagnoseTransactionRepo: Repository<DiagnoseTransaction>,
    @InjectRepository(ProceduresTransaction)
    private readonly proceduresTransactionRepo: Repository<ProceduresTransaction>,
    @InjectRepository(ClaimRuleResult)
    private readonly claimRuleResultsRepo: Repository<ClaimRuleResult>,
   private readonly ruleEngineService: RuleEngineService,
  ) {}

  async queueFileImport(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(RESPONSE_MESSAGE.VALIDATION.FILE_NOT_FOUND);
    }

    // Create ImportJob record with UUID
    const importJob = await this.importJobRepo.save({
      filename: file.originalname,
      status: 'pending',
      total_records: 0,
      processed_records: 0,
      progress: 0,
      started_at: null,
      completed_at: null,
    });

    // Queue job with UUID
    const job = await this.claimsQueue.add(
      {
        fileBuffer: file.buffer,
        fileName: file.originalname,
        importJobId: importJob.id,
      },
      {
        attempts: 3, // Retry 3 kali jika gagal
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    this.logger.log(
      `[Import Job ${importJob.id}] queued (bullJobId=${String(job.id)})`,
    );

    return importJob.id;
  }

  async getJobStatus(jobId: string) {
    const importJob = await this.importJobRepo.findOne({
      where: { id: jobId },
    });
    if (!importJob) {
        throw new BusinessException(RESPONSE_MESSAGE.JOB.NOT_FOUND);
    }

    return {
      import_job_id: importJob.id,
      file_name: importJob.filename,
      status: importJob.status,
      total_records: importJob.total_records,
      processed_records: importJob.processed_records,
      progress: importJob.progress,
      started_at: importJob.started_at,
      completed_at: importJob.completed_at,
    };
  }

  async create(dto: DeepPartial<Claim>) {
    const claim = this.claimRepo.create(dto);
    return this.claimRepo.save(claim);
  }

  async getImportJobs(page: number = 1, limit: number = 100, search: string = ''):Promise<[ImportJob[], number]> {
    const [data, total] = await Promise.all([
      this.importJobRepo.find({
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' },
      }),
      this.importJobRepo.count(),
    ]);
    return [data, total];
  }

  async getImportJobsById(id: string) {
    const importJob = await this.importJobRepo.findOne({ where: { id } });
    if (!importJob) {
      throw new BusinessException(RESPONSE_MESSAGE.JOB.NOT_FOUND);
    }
    return importJob;
  }

  async getAllClaims(page: number = 1, limit: number = 100, search: string = ''): Promise<[Claim[], number]> {
     const queryBuilder = this.claimRepo.createQueryBuilder('claim');
    if (search) {
      queryBuilder.where('claim.nama_pasien LIKE :search', { search: `%${search}%` });
    }
    const claims = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await queryBuilder.getCount();
    return [claims, total];
  }

  async getClaimByJobId(
    import_job_id: string,
    page: number = 1,
    limit: number = 100,
    search: string = '',
  ): Promise<[Claim[], number]> {
    const [data, total] = await Promise.all([
      this.claimRepo.find({
        where: { import_job_id, nama_pasien: search ? Like(`%${search}%`) : undefined },
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' },
      }),
      this.claimRepo.count({ where: { import_job_id } }),
    ]);
    
    return [data, total];
  }

  async analyzeClaim(import_job_id: string) {
    const [dataClaim, _] = await this.getClaimByJobId(import_job_id, 1, 1);

    if (dataClaim.length === 0) {
      throw new BusinessException(RESPONSE_MESSAGE.CLAIM.NOT_FOUND);
    }

    //delete if exist
    await this.claimRuleResultsRepo.delete({
      import_job_id: import_job_id,
    });

    // //data pasien yang melebihi batas los terlalu lama
    // const dataOverstay = await this.overstayedAnalysis(import_job_id);
    // await this.claimResultsRepo.insert(dataOverstay);

    //data pasien masuk di hari yang sama
    const dataDuplicateSameDay = await this.rajalVsRanapAnalysis(import_job_id);
    await this.claimRuleResultsRepo.insert(dataDuplicateSameDay);

    //data pasien rawat jalan lebih dari 1 kali dalam 1 hari
    const dataVisitRajalLebihDari1KaliDlm1Hari = await this.visitRajalLebihDari1KaliDlm1Hari(import_job_id);
    await this.claimRuleResultsRepo.insert(dataVisitRajalLebihDari1KaliDlm1Hari);

    //rule engine
    const fullClaims = await this.claimRepo.find({where: { import_job_id: import_job_id },});
    await this.ruleEngineService.evaluateBatch(fullClaims,import_job_id,);

    return import_job_id;
  }

  //excellences v2
  async rajalVsRanapAnalysis(import_job_id: string) {
    const dataRajalVsRanapAnalysis = (await this.claimRepo.query(
      `
    SELECT c.*
    FROM claims c
    JOIN (
        SELECT
            admission_date,
            nama_pasien,
            mrn
        FROM claims
        WHERE import_job_id = $1
        GROUP BY admission_date, nama_pasien, mrn
        HAVING
            COUNT(DISTINCT kategori) = 2
            AND BOOL_OR(kategori = 'Rawat Inap')
            AND BOOL_OR(kategori = 'Rawat Jalan')
    ) dup
    ON  c.admission_date = dup.admission_date
    AND c.nama_pasien     = dup.nama_pasien
    AND c.mrn             = dup.mrn
    WHERE c.import_job_id = $1
    ORDER BY c.admission_date ASC;
      `,
      [import_job_id],
    )) as Array<{ id: number; import_job_id: string }>;

    const groupName = 'Kunjungan rawat jalan dan rawat inap dihari yang sama';

    const duplicateSameDayRows: Array<
      DeepPartial<ClaimRuleResult>
    > = [];

    for (const row of dataRajalVsRanapAnalysis) {
      duplicateSameDayRows.push({
        import_job_id: row.import_job_id,
        claim: row.id as any,
        rule: null as any,
        triggered: false,
        score_generated: 60,
        message_generated: groupName,
        evaluated_at: new Date(),
        category: 'READMISSION',
        severity: 'HIGH',
        source: 'plain-analysis',
      });
    }

    return duplicateSameDayRows;
  }

    //excellences v2
  async visitRajalLebihDari1KaliDlm1Hari(import_job_id: string) {
    const data = (await this.claimRepo.query(
      `
SELECT c.*
FROM claims c
JOIN (
    SELECT
        admission_date,
        nama_pasien,
        mrn
    FROM claims
    WHERE import_job_id = $1
      AND kategori = 'Rawat Jalan'
    GROUP BY admission_date, nama_pasien, mrn
    HAVING COUNT(*) > 1
) dup
ON  c.admission_date = dup.admission_date
AND c.nama_pasien     = dup.nama_pasien
AND c.mrn             = dup.mrn
WHERE c.import_job_id = $1
  AND c.kategori = 'Rawat Jalan'
ORDER BY c.admission_date ASC;
      `,
      [import_job_id],
    )) as Array<{ id: number; import_job_id: string }>;

    const groupName = 'Pasien kunjungan rawat jalan lebih dari 1 kali dalam 1 hari';

    const duplicateSameDayRows: Array<
      DeepPartial<ClaimRuleResult>
    > = [];

    for (const row of data) {
      duplicateSameDayRows.push({
        import_job_id: row.import_job_id,
        claim: row.id as any,
        rule: null as any,
        triggered: false,
        score_generated: 60,
        message_generated: groupName,
        evaluated_at: new Date(),
        category: 'READMISSION',
        severity: 'HIGH',
        source: 'plain-analysis',
      });
    }

    return duplicateSameDayRows;
  }

  async getAnalyzedClaim(
    import_job_id: string,
    page: number = 1,
    limit: number = 100,
    group_results: string,
  ): Promise<[ClaimRuleResult[], number]> {
    const normalizedGroupResults =
      group_results && group_results !== 'false' ? group_results : undefined;

    const baseQuery = this.claimRuleResultsRepo
      .createQueryBuilder('claim_rule_results')
      .innerJoin(Claim, 'claims', 'claims.id = claim_rule_results.claimId')
      .where('claim_rule_results.import_job_id = :import_job_id', { import_job_id });

    if (normalizedGroupResults) {
      baseQuery.andWhere('claim_rule_results.category = :group_results', {
        group_results: normalizedGroupResults,
      });
    }

    const [data, total] = await Promise.all([
      baseQuery
        .clone()
        .select([
          'claim_rule_results.import_job_id AS import_job_id',
          'claims.id AS claim_id',
          'claims.nama_pasien AS nama_pasien',
          'claims.mrn AS mrn',
          'claims.admission_date AS admission_date',
          'claims.sep AS sep',
          'claims.kategori AS kategori',
          'claims.los AS los',
          'claims.diaglist AS diaglist',
          'claims.proclist AS proclist',
          'claims.dpjp AS dpjp',
          'claims.inacbg AS inacbg',
          'claims.deskripsi_inacbg AS deskripsi_inacbg',
          'claims.tarif_rs AS tarif_rs',
          'claims.tarif_inacbg AS tarif_inacbg',
          'claim_rule_results.category AS category',
          'claim_rule_results.triggered AS triggered',
          'claim_rule_results.score_generated AS score_generated',
          'claim_rule_results.message_generated AS message_generated',
          'claim_rule_results.severity AS severity',
          'claim_rule_results.source AS source',
        ])
        .orderBy('claims.admission_date', 'ASC')
        .offset((page - 1) * limit)
        .limit(limit)
        .getRawMany(),
      baseQuery.clone().getCount(),
    ]);

    return [data, total];
  }

  async deleteClaimByJobId(import_job_id: string) {
    const existingClaims = await this.claimRepo.find({
      where: { import_job_id },
    });
    if (existingClaims.length === 0) {
      throw new BusinessException(RESPONSE_MESSAGE.CLAIM.NOT_FOUND);
    }
    await this.importJobRepo.delete({ id: import_job_id });
    await this.claimRuleResultsRepo.delete({ import_job_id });
    await this.claimRepo.delete({ import_job_id });
    await this.diagnoseTransactionRepo.delete({ import_job_id });
    await this.proceduresTransactionRepo.delete({ import_job_id });
    return import_job_id;
  }

  // //excellences v3
  // async overstayedAnalysis(import_job_id: string) {
  //   const dataClaim = await this.claimRepo.find({
  //     where: {
  //       import_job_id: import_job_id,
  //     },
  //   });

  //   const overstayRows: Array<{
  //     import_job_id: string;
  //     claim_id: number;
  //     group_result: string;
  //     sub_group_result: string;
  //     description?: string;
  //   }> = [];

  //   const groupName = 'Overstay';

  //   for (const key of dataClaim) {
  //     const getOverStay = await this.overStayRepo
  //       .createQueryBuilder()
  //       .where('is_active = :isActive', { isActive: true })
  //       .andWhere('category = :category', { category: key.kategori })
  //       .andWhere(':value BETWEEN value_start AND value_end', {
  //         value: key.los,
  //       })
  //       .getOne();

  //     const subGroupName = key.kategori;
  //     const descriptionName = getOverStay?.description;

  //     if (getOverStay?.is_overstay == true) {
  //       overstayRows.push({
  //         import_job_id: key.import_job_id,
  //         claim_id: key.id,
  //         group_result: groupName,
  //         sub_group_result: subGroupName,
  //         description: descriptionName,
  //       });
  //       // const result = await this.claimResultsRepo.createQueryBuilder()
  //       // .insert()
  //       // .into(ClaimResult)
  //       // .values({
  //       //   import_job_id: import_job_id,
  //       //   claim_id: key.id,
  //       //   group_result: 'OVERSTAY',
  //       //   sub_group_result: key.kategori,
  //       //   description: getOverStay.description
  //       // })
  //       // .execute();
  //     }
  //   }
  //   return overstayRows;
  // }

}
