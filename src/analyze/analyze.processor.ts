import { Process, Processor } from "@nestjs/bull";
import type { Job } from "bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Claim } from "src/claims/entities/claim.entity";
import { ImportJob } from "src/claims/entities/import.entity";
import { RuleEngineService } from "src/rule-engine/rule-engine.service";
import { Repository } from "typeorm";
import { ClaimsService } from "src/claims/claims.service";

@Processor('analyze')
export class AnalyzeProcessor {
    constructor(
        @InjectRepository(Claim)
        private readonly claimRepo: Repository<Claim>,
        private readonly ruleEngineService: RuleEngineService,
        @InjectRepository(ImportJob)
        private readonly importRepo: Repository<ImportJob>,
        private readonly claimService: ClaimsService,
    ) {}

    @Process({ name: 'analyze-claims', concurrency: 3 })
    async handle(job: Job){
        const { importJobId } = job.data;

        console.log('Start analyze:', importJobId);

        await this.importRepo.update(importJobId, {
            status: 'ANALYZING',
        });

        //data pasien masuk di hari yang sama
        const dataDuplicateSameDay = await this.claimService.rajalVsRanapAnalysis(importJobId);
        await this.claimService.createRuleResult(dataDuplicateSameDay);
        
        //data pasien rawat jalan lebih dari 1 kali dalam 1 hari
        const dataVisitRajalLebihDari1KaliDlm1Hari = await this.claimService.visitRajalLebihDari1KaliDlm1Hari(importJobId);
        await this.claimService.createRuleResult(dataVisitRajalLebihDari1KaliDlm1Hari);
        
        //data pasien rawat jalan lebih dari 3 kali dalam 1 minggu
        const dataVisitRajalLebihDari3KaliDlm1Minggu = await this.claimService.visitRajalLebihDari4KaliDlm1Minggu(importJobId);
        await this.claimService.createRuleResult(dataVisitRajalLebihDari3KaliDlm1Minggu);
        
        //data pasien rawat inap lebih dari 1 kali dalam 1 bulan
        const dataVisitRanapLebihDari1KaliDlm1Bulan = await this.claimService.visitRanapLebihDari1KaliDlm1Bulan(importJobId);
        await this.claimService.createRuleResult(dataVisitRanapLebihDari1KaliDlm1Bulan);

        const batchSize = 1000;
        let page = 0;

        while (true){
            const claims = await this.claimRepo.find({
                where: {import_job_id: importJobId },
                take: batchSize,
                skip: page * batchSize,
            });

            if (!claims.length) break;

            //await this.claimService.analyzeClaim(importJobId)


            //rule engine evaluation
            await this.ruleEngineService.evaluateBatch(
                claims,
                importJobId,
            );

            
            page++;
        }

        await this.importRepo.update(importJobId, {
            status: 'DONE',
        });

        console.log('Finish analyze:', importJobId);
    }
}
