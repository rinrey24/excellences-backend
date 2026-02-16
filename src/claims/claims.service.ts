import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository,Or,Equal, Between } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Claim } from './entities/claim.entity';
import { ImportJob } from './entities/import.entity';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';
import { ProceduresTransaction } from './entities/procedures-transaction.entity';
import { DiagnoseTransaction } from './entities/diagnose-transaction.entity';
import { ClaimResult } from './entities/claim.results.entity';
import { Overstay } from 'src/overstays/entities/overstay.entity';

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
    @InjectRepository(ClaimResult)
    private readonly claimResultsRepo: Repository<ClaimResult>,
    @InjectRepository(Overstay)
    private readonly overStayRepo: Repository<Overstay>
  ) {}

  async queueFileImport(file: Express.Multer.File) {
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


    return {
      message: RESPONSE_MESSAGE.JOB.QUEUED,
      jobId: importJob.id,
    };
  }

  async getJobStatus(jobId: string) {
    const importJob = await this.importJobRepo.findOne({ where: { id: jobId } });
    if (!importJob) {
      return { message: RESPONSE_MESSAGE.JOB.NOT_FOUND };
    }

    return {
      job_id: importJob.id,
      file_name: importJob.filename,
      status: importJob.status,
      total_records: importJob.total_records,
      processed_records: importJob.processed_records,
      progress: importJob.progress,
      started_at: importJob.started_at,
      completed_at: importJob.completed_at,
    };
  }

  async create(dto: any) {
    const claim = this.claimRepo.create(dto);
    return this.claimRepo.save(claim);
  }

  async getImportJobs(page: number = 1, limit: number = 100) {
    const [data, total] = await Promise.all([
      this.importJobRepo.find({
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' }
      }),
      this.importJobRepo.count()
    ]);

    return formatPaginatedResponse(RESPONSE_MESSAGE.JOB.FETCHED,data, total, page, limit);
  }
  
  async getImportJobsById(id: string) {
    return this.importJobRepo.findOne({ where: { id } });
  }
  
  async getAllClaims(page: number = 1, limit: number = 100) {
    const [data, total] = await Promise.all([
      this.claimRepo.find({
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' }
      }),
      this.claimRepo.count()
    ]);

    return formatPaginatedResponse(RESPONSE_MESSAGE.CLAIM.FETCHED, data, total, page, limit);
  }

  async getClaimByJobId(import_job_id: string, page: number = 1, limit: number = 100) {
    const [data, total] = await Promise.all([
      this.claimRepo.find({
        where: { import_job_id },
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' }
      }),
      this.claimRepo.count({ where: { import_job_id } })
    ]);

    return formatPaginatedResponse(RESPONSE_MESSAGE.CLAIM.FETCHED,data, total, page, limit);
  }

  async analyzeClaim(import_job_id: any) {
    //delete if exist
    await this.claimResultsRepo.delete({
      import_job_id: import_job_id
    });

    //data pasien yang melebihi batas los terlalu lama
    const dataOverstay = await this.overstayedAnalysis(import_job_id)
    await this.claimResultsRepo.insert(dataOverstay)

    //data pasien masuk di hari yang sama 
    const dataDuplicateSameDay = await this.rajalVsRanapAnalysis(import_job_id)
    await this.claimResultsRepo.insert(dataDuplicateSameDay);
    
    
    return RESPONSE_MESSAGE.CLAIM.ANALYZED

  }

  //excellences v2
  async rajalVsRanapAnalysis(import_job_id: any) {
    const dataRajalVsRanapAnalysis = await this.claimRepo.query(`
      SELECT c.*
FROM claims c
JOIN (
    SELECT admission_date, nama_pasien, mrn
    FROM claims
    WHERE import_job_id = $1
    GROUP BY admission_date, nama_pasien, mrn
    HAVING COUNT(*) > 1
) dup
ON c.admission_date = dup.admission_date
AND c.nama_pasien = dup.nama_pasien
AND c.mrn = dup.mrn
WHERE c.import_job_id = $1
ORDER BY c.admission_date ASC;
      `,[import_job_id]);

      const groupName = 'Hari Yang Sama';
      const subGroupName = '-';
      const descriptionName = 'DATA PASIEN MASUK "RAJAL DI HARI YANG SAMA", DAN "RAJAL BESERTA RANAP DI HARI YANG SAMA".';

      const duplicateSameDayRows: Array<{ 
        import_job_id: string,
        claim_id: number,
        group_result: string,
        sub_group_result: string,
        description: string
      }> = [];

      for (const row of dataRajalVsRanapAnalysis) {
        duplicateSameDayRows.push({ 
          import_job_id : row.import_job_id,
          claim_id : row.id,
          group_result : groupName,
          sub_group_result : subGroupName,
          description : descriptionName,
         });
      }
      
      return duplicateSameDayRows;
  };

  //excellences v3
  async overstayedAnalysis(import_job_id: any) {

    const dataClaim = await this.claimRepo.find({
      where: {
        import_job_id: import_job_id
      },
    });

    const overstayRows: Array<{ 
      import_job_id: string,
      claim_id: number,
      group_result: string,
      sub_group_result: string,
      description: any
    }> = [];
    
    const groupName = 'Kunjungan Hari Yang Sama';

    for (const key of dataClaim){
      const getOverStay = await  this.overStayRepo.createQueryBuilder()
      .where("is_active = :isActive", { isActive: true })
      .andWhere("category = :category", { category: key.kategori })
      .andWhere(":value BETWEEN value_start AND value_end", { value: key.los })
      .getOne();

      const subGroupName = key.kategori;
      const descriptionName = getOverStay?.description;

      if (getOverStay?.description == 'Overstay'){
        overstayRows.push({ 
          import_job_id : key.import_job_id,
          claim_id : key.id,
          group_result : groupName,
          sub_group_result : subGroupName,
          description : descriptionName,
         });
        // const result = await this.claimResultsRepo.createQueryBuilder()
        // .insert()
        // .into(ClaimResult)
        // .values({ 
        //   import_job_id: import_job_id,
        //   claim_id: key.id,
        //   group_result: 'OVERSTAY',
        //   sub_group_result: key.kategori,
        //   description: getOverStay.description
        // })
        // .execute();
      }

    }

    return overstayRows;

  }



}
