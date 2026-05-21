import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/base/base.entity";

@Entity('procedures')
export class Procedure extends BaseEntity {

    @Column()
    code!: string;

    @Column()
    description!: string;

}
