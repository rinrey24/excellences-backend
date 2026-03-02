import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'claim_severity_view',  // nama view di database
})
export class RekapSeverityView {

  @ViewColumn()
  import_job_id!: string;

  @ViewColumn()
  kategori!: string;

  @ViewColumn()
  severity_level!: string;

  @ViewColumn()
  avg_los!: number;

  @ViewColumn()
  tarif_inacbg!: number;
}