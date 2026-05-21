import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'claim_summary_view',  // nama view di database
})
export class ClaimSummaryView {

  @ViewColumn()
  import_job_id!: string;

  @ViewColumn()
  kategori!: string;

  @ViewColumn()
  jumlah_kasus!: number;

  @ViewColumn()
  tarif_inacbg!: number;

  @ViewColumn()
  tarif_rs!: number;

  @ViewColumn()
  selisih!: number;

  @ViewColumn()
  percentage!: number;
}