import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'claim_type_case_view',  // nama view di database
})
export class RekapTipeKasusView {

  @ViewColumn()
  import_job_id!: string;

  @ViewColumn()
  tipe_kasus!: string;

  @ViewColumn()
  description!: string;

  @ViewColumn()
  jumlah_kasus!: number;
}