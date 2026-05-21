import { Column,CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/base/base.entity";

@Entity('diagnoses')
export class Diagnosis extends BaseEntity {

    @Column()
    code!: string;

    @Column()
    description!: string;
}
