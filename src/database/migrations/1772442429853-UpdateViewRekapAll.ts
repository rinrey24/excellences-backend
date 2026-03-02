import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateClaimSummaryView1700000000001 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW claim_summary_view AS
      SELECT 
          import_job_id,
          kategori,
          COUNT(*) AS jumlah_kasus,
          SUM(tarif_inacbg) AS tarif_inacbg,
          SUM(tarif_rs) AS tarif_rs,
          SUM(tarif_inacbg) - SUM(tarif_rs) AS selisih,
          SUM(tarif_inacbg) / NULLIF(SUM(tarif_rs), 0) * 100 AS percentage,
          AVG(tarif_rs) AS rata_rata_tarif
      FROM claims
      GROUP BY import_job_id, kategori;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW claim_summary_view AS
      SELECT 
          import_job_id,
          kategori,
          COUNT(*) AS jumlah_kasus,
          SUM(tarif_inacbg) AS tarif_inacbg,
          SUM(tarif_rs) AS tarif_rs,
          SUM(tarif_inacbg) - SUM(tarif_rs) AS selisih,
          SUM(tarif_inacbg) / NULLIF(SUM(tarif_rs), 0) * 100 AS percentage
      FROM claims
      GROUP BY import_job_id, kategori;
    `);
  }
}