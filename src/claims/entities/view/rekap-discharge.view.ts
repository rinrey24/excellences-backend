import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'claim_discharge_view',  // nama view di database
})
export class RekapDischargeView {

  @ViewColumn()
  import_job_id!: string;

  @ViewColumn()
  discharge_status!: string;

  @ViewColumn()
  discharge_description!: string;

  @ViewColumn()
  jumlah_kasus!: number;
}