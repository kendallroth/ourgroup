import {MigrationInterface, QueryRunner} from "typeorm";

export class accounts1643948640200 implements MigrationInterface {
    name = 'accounts1643948640200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "invalidated_at" TIMESTAMP WITH TIME ZONE, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "token" text NOT NULL, "account_id" uuid NOT NULL, CONSTRAINT "UQ_c31d0a2f38e6e99110df62ab0af" UNIQUE ("token"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."verification_code_type_enum" AS ENUM('account_verification', 'password_reset')`);
        await queryRunner.query(`CREATE TABLE "verification_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "invalidated_at" TIMESTAMP WITH TIME ZONE, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "code" text NOT NULL, "type" "public"."verification_code_type_enum" NOT NULL, "account_id" uuid NOT NULL, CONSTRAINT "UQ_59d1a0ba0cb807a8c9993f066dc" UNIQUE ("code"), CONSTRAINT "PK_d702c086da466e5d25974512d46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" text NOT NULL, "name" text, "password" text NOT NULL, "last_login_at" TIMESTAMP WITH TIME ZONE, "verified_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_f8e6c51db7655e2f7084f615681" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification_code" ADD CONSTRAINT "FK_c4fdce18528437078c9d49c945c" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification_code" DROP CONSTRAINT "FK_c4fdce18528437078c9d49c945c"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_f8e6c51db7655e2f7084f615681"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "verification_code"`);
        await queryRunner.query(`DROP TYPE "public"."verification_code_type_enum"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
    }

}
