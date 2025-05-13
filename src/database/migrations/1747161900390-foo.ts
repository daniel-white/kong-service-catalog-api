import { MigrationInterface, QueryRunner } from "typeorm";

export class Foo1747161900390 implements MigrationInterface {
    name = 'Foo1747161900390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants" ("id" character(29) NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" character(29) NOT NULL, "name" character varying(255) NOT NULL, "description" character varying NOT NULL, "tenantId" character(29), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_c61e3da9e437d4534faa63cf94a" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_c61e3da9e437d4534faa63cf94a"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
    }

}
