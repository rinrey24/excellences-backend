import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('claims')
export class Claim {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    import_job_id!: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
  kode_rs!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  kelas_rs!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  kelas_rawat!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  kode_tarif!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ptd!: string;

  @Column({ type: 'date', nullable: true })
  admission_date!: Date;

  @Column({ type: 'date', nullable: true })
  discharge_date!: Date;

  @Column({ type: 'date', nullable: true })
  birth_date!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  birth_weight!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sex!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  discharge_status!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  diaglist!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  proclist!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  adl1!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  adl2!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  in_sp!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  in_sr!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  in_si!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  in_sd!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  inacbg!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subacute!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  chronic!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sp!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sr!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  si!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sd!: string;

  @Column({ type: 'text', nullable: true })
  deskripsi_inacbg!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_inacbg!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_subacute!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_chronic!: number;

  @Column({ type: 'text', nullable: true })
  deskripsi_sp!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_sp!: number;

  @Column({ type: 'text', nullable: true })
  deskripsi_sr!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_sr!: number;

  @Column({ type: 'text', nullable: true })
  deskripsi_si!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_si!: number;

  @Column({ type: 'text', nullable: true })
  deskripsi_sd!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_sd!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  total_tarif!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_rs!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tarif_poli_eks!: number;

  @Column({ type: 'int', nullable: true })
  los!: number;

  @Column({ type: 'int', nullable: true })
  icu_indikator!: number;

  @Column({ type: 'int', nullable: true })
  icu_los!: number;

  @Column({ type: 'int', nullable: true })
  vent_hour!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  nama_pasien!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  mrn!: string;

  @Column({ type: 'int', nullable: true })
  umur_tahun!: number;

  @Column({ type: 'int', nullable: true })
  umur_hari!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  dpjp!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sep!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  nokartu!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  payor_id!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coder_id!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  versi_inacbg!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  versi_grouper!: string;

  @Column({ type: 'text', nullable: true })
  c1!: string;

  @Column({ type: 'text', nullable: true })
  c2!: string;

  @Column({ type: 'text', nullable: true })
  c3!: string;

  @Column({ type: 'text', nullable: true })
  c4!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  prosedur_non_bedah!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  prosedur_bedah!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  konsultasi!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tenaga_ahli!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  keperawatan!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  penunjang!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  radiologi!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  laboratorium!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  pelayanan_darah!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  rehabilitasi!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  kamar_akomodasi!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  rawat_intensif!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  obat!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  alkes!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  bmhp!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  sewa_alat!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  obat_kronis!: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  obat_kemo!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  severity_level!: string;
  
  @Column({ type: 'varchar', length: 50, nullable: true })
  kategori!: string;

  @Column({ type: 'jsonb', nullable: true })
  raw_json!: any;

  @CreateDateColumn({ type: 'timestamp' })
  created_at! : Date;
}
