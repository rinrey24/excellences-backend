import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimSummaryView } from 'src/claims/entities/view/claim-summary.view';
import { RekapDischargeView } from 'src/claims/entities/view/rekap-discharge.view';
import { RekapSeverityView } from 'src/claims/entities/view/rekap-severity.view';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(ClaimSummaryView)
        private claimSummaryViewRepo: Repository<ClaimSummaryView>,
        @InjectRepository(RekapSeverityView)
        private rekapSeverityViewRepo: Repository<RekapSeverityView>,
        @InjectRepository(RekapDischargeView)
        private rekapDischargeViewRepo: Repository<RekapDischargeView>,
    ) {}

    async getRekapSummary (import_job_id: string){
        const result = await this.claimSummaryViewRepo.find({
            where: {
                import_job_id: import_job_id,
            },
        });
        return result;
    }1
    

    async getRekapSeverity (import_job_id: string){
        const query = this.rekapSeverityViewRepo.createQueryBuilder('claim_severity_view')
        .where("claim_severity_view.import_job_id = :import_job_id", { import_job_id })
        .orderBy('claim_severity_view.kategori', 'ASC')
        .getMany();
        return query;
    }
    
    async getRekapDischarge (import_job_id: string){
        const query = this.rekapDischargeViewRepo.createQueryBuilder('claim_discharge_view')
        .where("claim_discharge_view.import_job_id = :import_job_id", { import_job_id })
        .orderBy('claim_discharge_view.discharge_status', 'ASC')
        .getMany();
        return query;
    }

}
