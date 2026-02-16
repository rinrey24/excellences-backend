import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('claim_results')
export class ClaimResult {
    @PrimaryGeneratedColumn('uuid')
    id! : string;

    @Column()
    import_job_id! : string

    @Column()
    claim_id! : number
    
    @Column()
    group_result! : string
    
    @Column({ nullable : true})
    sub_group_result? : string

    @Column({ nullable: true})
    description? : string

    @CreateDateColumn()
    created_at!: Date

}