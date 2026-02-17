import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('procedures')
export class Procedure {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    code!: string;

    @Column()
    description!: string;
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

}
