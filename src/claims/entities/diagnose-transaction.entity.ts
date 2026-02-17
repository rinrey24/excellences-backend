import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('diagnose_transactions')
export class DiagnoseTransaction {
    @PrimaryGeneratedColumn("uuid")
    id! : string
    
    @Column()
    import_job_id! : string

    @Column()
    claim_id! : number

    @Column()
    diagnose_code! : string

    @CreateDateColumn()
    created_at! : Date

}
