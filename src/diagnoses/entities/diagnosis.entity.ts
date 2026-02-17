import { Column,CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('diagnoses')
export class Diagnosis {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    code!: string;

    @Column()
    description!: string;
        
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;
}
