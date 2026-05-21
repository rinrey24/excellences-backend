import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/base/base.entity";

@Entity('diagnose_transactions')
export class DiagnoseTransaction extends BaseEntity {
    @Column()
    import_job_id! : string

    @Column()
    claim_id! : number

    @Column()
    diagnose_code! : string
}
