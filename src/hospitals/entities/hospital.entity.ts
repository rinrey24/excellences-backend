import {  Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/base/base.entity";
import { Rule } from "src/rules/entities/rule.entity";
import { Claim } from "src/claims/entities/claim.entity";

@Entity('hospitals')
export class Hospital extends BaseEntity {
    @Column({ unique: true })
    code!: string;

    @Column()
    name!: string;

    @Column()
    class!: string;

    @Column()
    address!: string;

    @Column({ nullable: true})
    phone!: string;
    
    @Column({ default: 0 })
    max_visit_rj_permonth!: number;
    
    @Column({ default: 0 })
    max_visit_ri_permonth!: number;

    @OneToMany(() => Claim, (claim) => claim.kode_rs)
    claims!: Claim[];

    @OneToMany(() => Rule, (rule) => rule.hospital)
    rules!: Rule[];
}
