import {  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/base/base.entity";

@Entity({ name: 'overstays' })
export class Overstay extends BaseEntity {

    @Column({ type: 'varchar', length: 500 , nullable: false })
    category!: string;

    @Column()
    value_start!: number;

    @Column()
    value_end!: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    description?: string;
    
    @Column({ type: 'boolean', default: true })
    is_overstay!: boolean;

    @Column({ type: 'boolean', default: true })
    is_active!: boolean;
}
