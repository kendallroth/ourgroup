import { Entity, ManyToOne, Column, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

// Models
import { UsableTokenEntity } from "@common/entities";
import { Account } from "@modules/account/entities";

// Types
import { VerificationCodeType } from "../types";

@Entity({ name: "verification_code" })
export class VerificationCode extends UsableTokenEntity {
  /** Verification code ID */
  @PrimaryGeneratedColumn("uuid", { name: "verification_code_id" })
  id!: string;

  /** Verification code */
  @Column("text", { unique: true })
  code!: string;

  /** Verification code type */
  @Column({
    type: "enum",
    enum: VerificationCodeType,
  })
  type!: VerificationCodeType;

  /** "Duplicated" column for easier entity access */
  @Column("uuid", { name: "account_id" })
  accountId!: string;

  /// Relationships ////////////////////////////////////////////////////////////

  /** Verification code owner */
  @ManyToOne(() => Account, (account: Account) => account.verificationCodes)
  @JoinColumn({ name: "account_id" })
  account!: Account;
}
