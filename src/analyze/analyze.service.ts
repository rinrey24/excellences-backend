import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Queue } from 'bull';
import { ClaimsService } from 'src/claims/claims.service';
import { ClaimRuleResult } from 'src/claims/entities/claim-rule-result.entity';
import { Claim } from 'src/claims/entities/claim.entity';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyzeService {
    constructor(
        @InjectQueue('analyze') 
        private readonly analyzeQueue: Queue,
        private readonly claimService: ClaimsService,
        @InjectRepository(ClaimRuleResult)
        private readonly claimRuleResultsRepo: Repository<ClaimRuleResult>,
        @InjectRepository(Claim)
        private readonly claimRepo: Repository<Claim>,
    ) {}

    async enqueueAnalysis(importJobId: string) {

        const [dataClaim, _] = await this.claimService.getClaimByJobId(importJobId, 1, 1);
    
        if (dataClaim.length === 0) {
            throw new BusinessException(RESPONSE_MESSAGE.CLAIM.NOT_FOUND);
        }

        //delete if exist
        await this.claimService.deleteClaimResultByJobId(importJobId);

        const job = await this.analyzeQueue.add(
            'analyze-claims',
            { importJobId },
            {
                attempts: 3,
                removeOnComplete:true,
            }
        );
    };

    async getAnalyzedClaim(
    import_job_id: string,
    page: number = 1,
    limit: number = 100,
    category: string,
  ): Promise<[ClaimRuleResult[], number]> {
    const normalizedGroupResults =
      category && category !== 'false' ? category : undefined;

    const baseQuery = this.claimRuleResultsRepo
      .createQueryBuilder('claim_rule_results')
      .innerJoin(Claim, 'claims', 'claims.id = claim_rule_results.claimId')
      .where('claim_rule_results.import_job_id = :import_job_id', { import_job_id });

    if (normalizedGroupResults) {
      baseQuery.andWhere('claim_rule_results.category = :category', {
        category: normalizedGroupResults,
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
          'claims.kategori AS kategori_claim',
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
        .orderBy('claim_rule_results.category', 'ASC')
        .orderBy('claims.admission_date', 'ASC')
        .orderBy('claims.mrn', 'ASC')
        .offset((page - 1) * limit)
        .limit(limit)
        .getRawMany(),
      baseQuery.clone().getCount(),
    ]);

    return [data, total];
  }
}
