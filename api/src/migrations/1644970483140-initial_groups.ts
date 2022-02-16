import {MigrationInterface, QueryRunner} from "typeorm";

export class initialGroups1644970483140 implements MigrationInterface {
    name = 'initialGroups1644970483140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group_tag" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text, "color" text, "group_id" uuid NOT NULL, "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_208e630578ea380b677d73ee6f1" PRIMARY KEY ("name", "group_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_member_role_enum" AS ENUM('admin', 'manager', 'member')`);
        await queryRunner.query(`CREATE TABLE "group_member" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "group_member_id" uuid NOT NULL, "account_id" uuid NOT NULL, "group_id" uuid NOT NULL, "role" "public"."group_member_role_enum" NOT NULL DEFAULT 'member', "tagIds" text array, "removed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8da6aafb9442437f41bac9c5d8e" PRIMARY KEY ("group_member_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_application_status_enum" AS ENUM('approved', 'pending', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "group" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "group_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" text NOT NULL, "name" text NOT NULL, "description" text, "color" text NOT NULL, "creator_account_id" uuid NOT NULL, "application_status" "public"."group_application_status_enum" NOT NULL DEFAULT 'pending', "application_handled_at" TIMESTAMP WITH TIME ZONE, "disabled_at" TIMESTAMP WITH TIME ZONE, "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_d3240eaf64d34439513e46cb495" UNIQUE ("slug"), CONSTRAINT "PK_7a17850f39a0b7ee48fa586b2fc" PRIMARY KEY ("group_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_invitation_status_enum" AS ENUM('accepted', 'pending', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "group_invitation" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "invalidated_at" TIMESTAMP WITH TIME ZONE, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "group_invitation_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "status" "public"."group_invitation_status_enum" NOT NULL DEFAULT 'pending', "group_member_id" uuid NOT NULL, "account_id" uuid, "group_id" uuid, CONSTRAINT "UQ_6947fc457081f49a264237a3fa0" UNIQUE ("token"), CONSTRAINT "REL_7ed7174dcfcc2d4deefb0d419c" UNIQUE ("group_member_id"), CONSTRAINT "PK_e9c2bbc74766f1694f56fcdb42d" PRIMARY KEY ("group_invitation_id"))`);
        await queryRunner.query(`ALTER TABLE "group_tag" ADD CONSTRAINT "FK_ad5a59f47420988a525a966048c" FOREIGN KEY ("group_id") REFERENCES "group"("group_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_member" ADD CONSTRAINT "FK_8f9218d5f872c53fc2aa794f0b4" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_member" ADD CONSTRAINT "FK_e200cd6ff3e3903c5be5ae1400e" FOREIGN KEY ("group_id") REFERENCES "group"("group_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_b27a05d71ce66ba6be4b4bf5176" FOREIGN KEY ("creator_account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_invitation" ADD CONSTRAINT "FK_39bb480fb3544c6004631665da5" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_invitation" ADD CONSTRAINT "FK_eb10d33ede2fa8dce934492c5a7" FOREIGN KEY ("group_id") REFERENCES "group"("group_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_invitation" ADD CONSTRAINT "FK_7ed7174dcfcc2d4deefb0d419cc" FOREIGN KEY ("group_member_id") REFERENCES "group_member"("group_member_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_invitation" DROP CONSTRAINT "FK_7ed7174dcfcc2d4deefb0d419cc"`);
        await queryRunner.query(`ALTER TABLE "group_invitation" DROP CONSTRAINT "FK_eb10d33ede2fa8dce934492c5a7"`);
        await queryRunner.query(`ALTER TABLE "group_invitation" DROP CONSTRAINT "FK_39bb480fb3544c6004631665da5"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_b27a05d71ce66ba6be4b4bf5176"`);
        await queryRunner.query(`ALTER TABLE "group_member" DROP CONSTRAINT "FK_e200cd6ff3e3903c5be5ae1400e"`);
        await queryRunner.query(`ALTER TABLE "group_member" DROP CONSTRAINT "FK_8f9218d5f872c53fc2aa794f0b4"`);
        await queryRunner.query(`ALTER TABLE "group_tag" DROP CONSTRAINT "FK_ad5a59f47420988a525a966048c"`);
        await queryRunner.query(`DROP TABLE "group_invitation"`);
        await queryRunner.query(`DROP TYPE "public"."group_invitation_status_enum"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TYPE "public"."group_application_status_enum"`);
        await queryRunner.query(`DROP TABLE "group_member"`);
        await queryRunner.query(`DROP TYPE "public"."group_member_role_enum"`);
        await queryRunner.query(`DROP TABLE "group_tag"`);
    }

}
