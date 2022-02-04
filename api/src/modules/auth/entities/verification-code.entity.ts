import { Entity, ManyToOne, Column, JoinColumn } from "typeorm";

// Models
import { UsableTokenEntity } from "@common/entities";
import { Account } from "@modules/account/entities";

// Types
import { VerificationCodeType } from "../types";

@Entity({ name: "verification_code" })
export class VerificationCode extends UsableTokenEntity {
  /** Verification code */
  @Column("text", { unique: true })
  public code!: string;

  /** Verification code type */
  @Column({
    type: "enum",
    enum: VerificationCodeType,
  })
  public type!: VerificationCodeType;

  @Column("uuid", { name: "account_id" })
  public accountId!: string;

  /** Verification code owner */
  @ManyToOne(() => Account, (account: Account) => account.verificationCodes)
  @JoinColumn({ name: "account_id" })
  public account!: Account;
}
