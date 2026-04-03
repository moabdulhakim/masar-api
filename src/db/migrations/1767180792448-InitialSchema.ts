import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1767180792448 implements MigrationInterface {
    name = 'InitialSchema1767180792448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phone" character varying NOT NULL, "rating" double precision NOT NULL DEFAULT '5', "vehicleType" "public"."driver_vehicletype_enum" NOT NULL DEFAULT 'car', "driverLicenseId" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'online', "workingHours" jsonb, "location" jsonb, "isAvailable" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_a543b386d47b7e80c3047522a48" UNIQUE ("phone"), CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ride" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startLocation" jsonb NOT NULL, "endLocation" jsonb NOT NULL, "cost" double precision NOT NULL, "status" "public"."ride_status_enum" NOT NULL DEFAULT 'requested', "version" integer NOT NULL, "driverId" uuid, CONSTRAINT "PK_f6bc30c4dd875370bafcb54af1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ride" ADD CONSTRAINT "FK_a212335bd593ecd23b665309e9d" FOREIGN KEY ("driverId") REFERENCES "driver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ride" DROP CONSTRAINT "FK_a212335bd593ecd23b665309e9d"`);
        await queryRunner.query(`DROP TABLE "ride"`);
        await queryRunner.query(`DROP TABLE "driver"`);
    }

}
