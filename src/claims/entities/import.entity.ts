import {  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/base/base.entity";

@Entity('import_jobs')
export class ImportJob extends BaseEntity {

    @Column()
    filename! : string

    @Column()
    status! : string

    @Column()
    total_records! : number

    @Column()
    processed_records! : number

    @Column({ default: 0 })
    progress! : number

    @Column({ type: 'timestamp', nullable: true })
    started_at!: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    completed_at!: Date | null;
}
