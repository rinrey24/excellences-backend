import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Claim } from './entities/claim.entity';
import { ImportJob } from './entities/import.entity';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';
import { ProceduresTransaction } from './entities/procedures-transaction.entity';
import { DiagnoseTransaction } from './entities/diagnose-transaction.entity';

@Injectable()
export class ClaimsService {
  private readonly logger = new Logger(ClaimsService.name);

  constructor(
    @InjectRepository(Claim)
    private readonly repo: Repository<Claim>,
    @InjectRepository(ImportJob)
    private readonly importJobRepo: Repository<ImportJob>,
    @InjectQueue('claims-import')
    private claimsQueue: Queue,
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
    const claim = this.repo.create(dto);
    return this.repo.save(claim);
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
      this.repo.find({
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' }
      }),
      this.repo.count()
    ]);

    return formatPaginatedResponse(RESPONSE_MESSAGE.CLAIM.FETCHED, data, total, page, limit);
  }

  async getClaimByJobId(import_job_id: string, page: number = 1, limit: number = 100) {
    const [data, total] = await Promise.all([
      this.repo.find({
        where: { import_job_id },
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' }
      }),
      this.repo.count({ where: { import_job_id } })
    ]);

    return formatPaginatedResponse(RESPONSE_MESSAGE.CLAIM.FETCHED,data, total, page, limit);
  }

  async analyzeClaim(import_job_id: any) {
    
    return {
      message: RESPONSE_MESSAGE.CLAIM.ANALYZED,
      data: await this.rajalVsRanapAnalysis(import_job_id)
    }

  }

  //excellences v2
  async rajalVsRanapAnalysis(import_job_id: any) {
    const dataRajalVsRanapAnalysis = await this.repo.query(`
      SELECT admission_date,nama_pasien ,mrn from claims where import_job_id=$1
      group by admission_date,nama_pasien,mrn
      having count(admission_date)>1
      order by admission_date  asc
      `,[import_job_id]);
      
      return dataRajalVsRanapAnalysis;
  };

  //excellences v3
  async overstayedAnalysis(import_job_id: any) {

  }



}
