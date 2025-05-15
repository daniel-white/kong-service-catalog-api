import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceVersions1747334379572 implements MigrationInterface {
  name = 'AddServiceVersions1747334379572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service_versions" ("id" character(29) NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "version" character varying(255) NOT NULL, "tenantId" character(29), "serviceId" character(29), CONSTRAINT "UQ_cdbbf949714243706a5048c3c41" UNIQUE ("version", "serviceId"), CONSTRAINT "PK_2cdf123a2486f00862495e81101" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_versions" ADD CONSTRAINT "FK_82a02fa6017a703c68509d83392" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_versions" ADD CONSTRAINT "FK_b94e0f41ebbfefd949ac1f0f60e" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_versions" DROP CONSTRAINT "FK_b94e0f41ebbfefd949ac1f0f60e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_versions" DROP CONSTRAINT "FK_82a02fa6017a703c68509d83392"`,
    );
    await queryRunner.query(`DROP TABLE "service_versions"`);
  }
}
