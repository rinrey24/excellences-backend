import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/base/base.entity";

@Entity('procedure_transactions')
export class ProceduresTransaction extends BaseEntity {
    
    @Column()
    import_job_id! : string

    @Column()
    claim_id! : number

    @Column()
    procedure_code! : string

}
