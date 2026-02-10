import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1770715652449 implements MigrationInterface {
    name = 'InitSchema1770715652449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "import_jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "status" character varying NOT NULL, "total_records" integer NOT NULL, "processed_records" integer NOT NULL, "started_at" TIMESTAMP, "completed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d206c602f173f98e4bb85819a3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "import_jobs"`);
    }

}
