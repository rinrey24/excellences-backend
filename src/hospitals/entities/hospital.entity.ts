import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('hospitals')
export class Hospital {
    @PrimaryGeneratedColumn()
    kode_rs!: number;

    @Column()
    name!: string;

    @Column()
    kelas_rs!: string;

    @Column()
    address!: string;

    @Column()
    phone!: string;

    @CreateDateColumn()
    created_at!: Date;
}
