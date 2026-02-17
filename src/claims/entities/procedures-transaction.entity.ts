import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('procedure_transactions')
export class ProceduresTransaction {
    @PrimaryGeneratedColumn("uuid")
    id! : string
    
    @Column()
    import_job_id! : string

    @Column()
    claim_id! : number

    @Column()
    procedure_code! : string

    @CreateDateColumn()
    created_at! : Date

}
