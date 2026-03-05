import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'claim_cmg_view',  // nama view di database
})
export class RekapCMGView {

  @ViewColumn()
  import_job_id!: string;

  @ViewColumn()
  code_cmg!: string;

  @ViewColumn()
  description!: string;

  @ViewColumn()
  jumlah_kasus!: number;

  @ViewColumn()
  avg_los!: number;
}