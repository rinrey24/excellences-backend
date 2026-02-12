import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('hospitals')
export class Hospital {
    @PrimaryColumn()
    kode_rs!: string;

    @Column()
    name!: string;

    @Column()
    kelas_rs!: string;

    @Column()
    address!: string;

    @Column({ nullable: true})
    phone!: string;

    @CreateDateColumn()
    created_at!: Date;
}
