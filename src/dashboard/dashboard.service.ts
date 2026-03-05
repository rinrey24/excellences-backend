import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimSummaryView } from 'src/claims/entities/view/claim-summary.view';
import { RekapCMGView } from 'src/claims/entities/view/rekap-cmg.view';
import { RekapDischargeView } from 'src/claims/entities/view/rekap-discharge.view';
import { RekapSeverityView } from 'src/claims/entities/view/rekap-severity.view';
import { RekapTipeKasusView } from 'src/claims/entities/view/rekap-tipe-kasus.view';
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
        @InjectRepository(RekapTipeKasusView)
        private rekapTipeKasusViewRepo: Repository<RekapTipeKasusView>,
        @InjectRepository(RekapCMGView)
        private rekapCMGViewRepo: Repository<RekapCMGView>,
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
        const data = this.rekapSeverityViewRepo.createQueryBuilder('claim_severity_view')
        .where("claim_severity_view.import_job_id = :import_job_id", { import_job_id })
        .orderBy('claim_severity_view.kategori', 'ASC')
        .getMany();
        return data;
    }
    
    async getRekapDischarge (import_job_id: string){
        const data = this.rekapDischargeViewRepo.createQueryBuilder('claim_discharge_view')
        .where("claim_discharge_view.import_job_id = :import_job_id", { import_job_id })
        .orderBy('claim_discharge_view.discharge_status', 'ASC')
        .getMany();
        return data;
    }
    
    async getRekapTipeKasus (import_job_id: string){
        const data = this.rekapTipeKasusViewRepo.createQueryBuilder('claim_type_case_view')
        .where("claim_type_case_view.import_job_id = :import_job_id", { import_job_id })
        .orderBy('claim_type_case_view.tipe_kasus', 'ASC')
        .getMany();
        return data;
    }
    
    async getRekapCMG (import_job_id: string){
        const data = this.rekapCMGViewRepo.createQueryBuilder('claim_cmg_view')
        .where("claim_cmg_view.import_job_id = :import_job_id", { import_job_id })
        .orderBy('claim_cmg_view.jumlah_kasus', 'DESC')
        .getMany();
        return data;
    }

}
