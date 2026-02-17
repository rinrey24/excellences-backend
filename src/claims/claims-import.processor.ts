import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './entities/claim.entity';
import { ImportJob } from './entities/import.entity';
import { parseInaDate } from '../common/utils/date.util';
import { Readable } from 'stream';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { DiagnoseTransaction } from './entities/diagnose-transaction.entity';
import { ProceduresTransaction } from './entities/procedures-transaction.entity';

@Processor('claims-import')
export class ClaimsImportProcessor {
  constructor(
    @InjectRepository(Claim)
    private readonly claimsRepo: Repository<Claim>,
    @InjectRepository(ImportJob)
    private readonly importJobRepo: Repository<ImportJob>,
    @InjectRepository(DiagnoseTransaction)
    private readonly diagTrsRepo: Repository<DiagnoseTransaction>,
    @InjectRepository(ProceduresTransaction)
    private readonly procTrsRepo: Repository<ProceduresTransaction>,
  ) {}

  @Process()
  async processImport(job: Job) {
    const { fileBuffer: rawFileBuffer, fileName, importJobId } = job.data;
    const batchSize = 500;
    const startTime = Date.now();

    // Update ImportJob status to 'processing'
    await this.importJobRepo.update(importJobId, {
      status: 'processing',
      started_at: new Date(),
    });

    let fileBuffer: Buffer;
    if (Buffer.isBuffer(rawFileBuffer)) {
      fileBuffer = rawFileBuffer;
    } else if (rawFileBuffer && rawFileBuffer.type === 'Buffer' && Array.isArray((rawFileBuffer as any).data)) {
      fileBuffer = Buffer.from((rawFileBuffer as any).data);
    } else if (rawFileBuffer && typeof rawFileBuffer === 'object' && Array.isArray((rawFileBuffer as any).data)) {
      fileBuffer = Buffer.from((rawFileBuffer as any).data);
    } else if (typeof rawFileBuffer === 'string') {
      try {
        fileBuffer = Buffer.from(rawFileBuffer, 'base64');
      } catch {
        fileBuffer = Buffer.from(rawFileBuffer, 'utf-8');
      }
    } else {
      throw new Error('Unsupported fileBuffer type in job data');
    }

    // Stream the buffer in smaller slices so 'data' events arrive progressively
    let _offset = 0;
    const CHUNK_SIZE = 64 * 1024; // 64KB
    const stream = new Readable({
      read() {
        if (_offset >= fileBuffer.length) {
          this.push(null);
          return;
        }
        const end = Math.min(_offset + CHUNK_SIZE, fileBuffer.length);
        const chunk = fileBuffer.slice(_offset, end);
        _offset = end;
        this.push(chunk);
      }
    });

    let headers: string[] = [];
    let batchRecords: any[] = [];
    let totalInserted = 0;
    let buffer = '';
    let isHeaderProcessed = false;
    let lineCount = 0;
    const totalBytes = fileBuffer.length;
    let processedBytes = 0;
    let pendingBatchPromise: Promise<any> | null = null;

    return new Promise((resolve, reject) => {
      stream.on('data', async (chunk: Buffer) => {
        try {
          stream.pause();

          buffer += chunk.toString('utf-8');
          const lines = buffer.split('\n');
          buffer = lines[lines.length - 1];

          // update processed bytes and progress
          processedBytes += (chunk as Buffer).length;
          const percent = totalBytes > 0 ? Math.min(100, Math.floor((processedBytes / totalBytes) * 100)) : 0;
          try { job.progress(percent); } catch (e) { /* ignore */ }
          try {
            await this.importJobRepo.update(importJobId, { progress: percent });
          } catch (e) { /* ignore */ }

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (!isHeaderProcessed) {
              headers = line.split('\t').map(h => h.trim());
              isHeaderProcessed = true;
              continue;
            }

            lineCount++;

            const vals = line.split('\t');
            if (vals.length !== headers.length) continue;

            const row: any = {};
            headers.forEach((h, idx) => {
              row[h] = vals[idx]?.trim() || '';
            });
            
            // if (row.INACBG.at(-1) == '0'){
              
            // }

            // Parse optional JSON payload from C2 safely.
            // Some rows may contain non-JSON values, so do not fail the whole import.
            let billingGroup: Record<string, any> = {};
            if (row.C2) {
              const index = row.C2.lastIndexOf('##');
              if (index !== -1) {
                const jsonString = row.C2.substring(index + 2).trim();
                if (jsonString) {
                  try {
                    const parsedJson = JSON.parse(jsonString);
                    billingGroup = parsedJson?.billing_group ?? {};
                  } catch {
                    billingGroup = {};
                  }
                }
              }
            }

            const procedure_amt = Number(billingGroup.procedure_amt || 0);
            const surgical_amt = Number(billingGroup.surgical_amt || 0);
            const consul_amt = Number(billingGroup.consul_amt || 0);
            const expert_amt = Number(billingGroup.expert_amt || 0);
            const nursing_amt = Number(billingGroup.nursing_amt || 0);
            const ancillary_amt = Number(billingGroup.ancillary_amt || 0);
            const blood_amt = Number(billingGroup.blood_amt || 0);
            const laboratory_amt = Number(billingGroup.laboratory_amt || 0);
            const radiology_amt = Number(billingGroup.radiology_amt || 0);
            const rehab_amt = Number(billingGroup.rehab_amt || 0);
            const room_amt = Number(billingGroup.room_amt || 0);
            const intensive_amt = Number(billingGroup.intensive_amt || 0);
            const drug_amt = Number(billingGroup.drug_amt || 0);
            const device_amt = Number(billingGroup.device_amt || 0);
            const consumable_amt = Number(billingGroup.consumable_amt || 0);
            const device_rent_amt = Number(billingGroup.device_rent_amt || 0);
            const drug_chronic_amt = Number(billingGroup.drug_chronic_amt || 0);
            const drug_chemo_amt = Number(billingGroup.drug_chemo_amt || 0);


            const record = {
              import_job_id: importJobId,
              kode_rs: row.KODE_RS || null,
              kelas_rs: row.KELAS_RS || null,
              kelas_rawat: row.KELAS_RAWAT || null,
              kode_tarif: row.KODE_TARIF || null,
              ptd: row.PTD || null,
              admission_date: parseInaDate(row.ADMISSION_DATE),
              discharge_date: parseInaDate(row.DISCHARGE_DATE),
              birth_date: parseInaDate(row.BIRTH_DATE),
              birth_weight: row.BIRTH_WEIGHT || null,
              sex: row.SEX || null,
              discharge_status: row.DISCHARGE_STATUS || null,
              diaglist: row.DIAGLIST || null,
              proclist: row.PROCLIST || null,
              adl1: row.ADL1 || null,
              adl2: row.ADL2 || null,
              in_sp: row.IN_SP || null,
              in_sr: row.IN_SR || null,
              in_si: row.IN_SI || null,
              in_sd: row.IN_SD || null,
              inacbg: row.INACBG || null,
              subacute: row.SUBACUTE || null,
              chronic: row.CHRONIC || null,
              sp: row.SP || null,
              sr: row.SR || null,
              si: row.SI || null,
              sd: row.SD || null,
              deskripsi_inacbg: row.DESKRIPSI_INACBG || null,
              tarif_inacbg: Number(row.TARIF_INACBG || 0),
              tarif_subacute: Number(row.TARIF_SUBACUTE || 0),
              tarif_chronic: Number(row.TARIF_CHRONIC || 0),
              deskripsi_sp: row.DESKRIPSI_SP || null,
              tarif_sp: Number(row.TARIF_SP || 0),
              deskripsi_sr: row.DESKRIPSI_SR || null,
              tarif_sr: Number(row.TARIF_SR || 0),
              deskripsi_si: row.DESKRIPSI_SI || null,
              tarif_si: Number(row.TARIF_SI || 0),
              deskripsi_sd: row.DESKRIPSI_SD || null,
              tarif_sd: Number(row.TARIF_SD || 0),
              total_tarif: Number(row.TOTAL_TARIF || 0),
              tarif_rs: Number(row.TARIF_RS || 0),
              tarif_poli_eks: Number(row.TARIF_POLI_EKS || 0),
              los: Number(row.LOS || 0),
              icu_indikator: Number(row.ICU_INDIKATOR || 0),
              icu_los: Number(row.ICU_LOS || 0),
              vent_hour: Number(row.VENT_HOUR || 0),
              nama_pasien: row.NAMA_PASIEN || null,
              mrn: row.MRN || null,
              umur_tahun: Number(row.UMUR_TAHUN || 0),
              umur_hari: Number(row.UMUR_HARI || 0),
              dpjp: row.DPJP || null,
              sep: row.SEP || null,
              nokartu: row.NOKARTU || null,
              payor_id: row.PAYOR_ID || null,
              coder_id: row.CODER_ID || null,
              versi_inacbg: row.VERSI_INACBG || null,
              versi_grouper: row.VERSI_GROUPER || null,
              c1: row.C1 || null,
              c2: row.C2 || null,
              c3: row.C3 || null,
              c4: row.C4 || null,
              prosedur_non_bedah: procedure_amt,
              prosedur_bedah: surgical_amt,
              konsultasi: consul_amt,
              tenaga_ahli: expert_amt,
              keperawatan: nursing_amt,
              penunjang: ancillary_amt,
              radiologi: blood_amt,
              laboratorium: laboratory_amt,
              pelayanan_darah: radiology_amt,
              rehabilitasi: rehab_amt,
              kamar_akomodasi: room_amt,
              rawat_intensif: intensive_amt,
              obat: drug_amt,
              alkes: device_amt,
              bmhp: consumable_amt,
              sewa_alat: device_rent_amt,
              obat_kronis: drug_chronic_amt,
              obat_kemo: drug_chemo_amt,
              severity_level: row.INACBG.at(-1) || null,
              kategori: row.INACBG.at(-1) === '0' ? 'Rawat Jalan' : 'Rawat Inap',
              cmg: row.INACBG.at(0) || null,
              tipe_kasus: row.INACBG.split('-')[1] || null,
              raw_json: row,
            };

            batchRecords.push(record);

            if (batchRecords.length >= batchSize) {
              // Track the batch insert promise and await its completion
              const recordsToBatch = batchRecords;
              batchRecords = [];
              
              pendingBatchPromise = this.insertBatch(recordsToBatch)
                .then(() => {
                  totalInserted += recordsToBatch.length;
                  // update progress after batch insert and update ImportJob processed_records
                  const percentAfterInsert = totalBytes > 0 ? Math.min(100, Math.floor((processedBytes / totalBytes) * 100)) : 0;
                  try { job.progress(percentAfterInsert); } catch (e) { /* ignore */ }
                  console.log(`[Import Job ${importJobId}] Batch inserted. Current total: ${totalInserted}, progress: ${percentAfterInsert}%`);
                  return this.importJobRepo.update(importJobId, {
                    processed_records: totalInserted,
                    progress: percentAfterInsert,
                  });
                })
                .catch((e) => console.error(`[Import Job ${importJobId}] Error updating batch progress:`, e));
            }
          }

          stream.resume();
        } catch (error) {
          console.log(error);
          stream.destroy();
          reject(error);
        }
      });

      stream.on('end', async () => {
        try {
          // Wait for any pending batch operation to complete
          if (pendingBatchPromise) {
            await pendingBatchPromise;
          }

          // Insert remaining records in buffer
          if (batchRecords.length > 0) {
            await this.insertBatch(batchRecords);
            totalInserted += batchRecords.length;
          }

          const duration = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`[Import Job ${importJobId}] Stream ended. Final count: ${totalInserted}`);

          // Update ImportJob with final status and counts - ATOMIC UPDATE
          const result = await this.importJobRepo.update(importJobId, {
            status: 'completed',
            total_records: totalInserted,
            processed_records: totalInserted,
            progress: 100,
            completed_at: new Date(),
          });
          console.log(`[Import Job ${importJobId}] Updated ${result.affected} rows: total_records=${totalInserted}, processed_records=${totalInserted}`);

          resolve({
            message: RESPONSE_MESSAGE.JOB.FINISHED,
            fileName,
            total: totalInserted,
            duration: `${duration} seconds`,
          });
        } catch (error) {
          console.error(`[Import Job ${importJobId}] Error on stream end:`, error);
          // Update ImportJob with failed status
          await this.importJobRepo.update(importJobId, {
            status: 'failed',
            completed_at: new Date(),
            progress: 0,
          }).catch((e) => console.error(`[Import Job ${importJobId}] Error updating failed status:`, e));
          reject(error);
        }
      });

      stream.on('error', async (error) => {
        // Update ImportJob with error status
        await this.importJobRepo.update(importJobId, {
          status: 'failed',
          completed_at: new Date(),
          progress: 0,
        }).catch(() => {});
        reject(error);
      });
    });
  }

  private async insertBatch(records: any[]) {
    if (records.length === 0) return;

    try {
      const result = await this.claimsRepo.createQueryBuilder()
        .insert()
        .into(Claim)
        .values(records)
        .returning(['id', 'diaglist', 'proclist']) // ambil id claim yang baru dibuat
        .execute();

        //insert diagnosa
        const insertedClaims = result.raw as Array<{ id: number; diaglist: string | null }>;
          const diagRows: Array<{ import_job_id: string; claim_id: number; diagnose_code: string }> = [];
        for (const claim of insertedClaims) {
          if (!claim.diaglist) continue;
          for (const code of claim.diaglist.split(';').map((v) => v.trim()).filter(Boolean)) {
            diagRows.push({ import_job_id: records[0].import_job_id, claim_id: claim.id, diagnose_code: code });
          }
        }
      if (diagRows.length > 0) {
        await this.diagTrsRepo.insert(diagRows);
      }

      //insert procedure
        const insertedProc = result.raw as Array<{ id: number; proclist: string | null }>;
        const procRows: Array<{ import_job_id: string; claim_id: number; procedure_code: string }> = [];
        for (const claim of insertedProc) {
          if (!claim.proclist) continue;  
          for (const code of claim.proclist.split(';').map((v) => v.trim()).filter(Boolean)) {
            procRows.push({ import_job_id: records[0].import_job_id, claim_id: claim.id, procedure_code: code });
          }
        }
      if (procRows.length > 0) {
        await this.procTrsRepo.insert(procRows);
      }

      //insert claim results
      // const insertedLos = result.raw as Array<{ id: number;los: number | null}>;
      // const resultRows: Array<{claim_id: number; los: number}> = [];

      console.log(`✓ Inserted ${records.length} records`);
    } catch (error) {
      console.error('Insert error:', error);
      throw error;
    }
  }

}
