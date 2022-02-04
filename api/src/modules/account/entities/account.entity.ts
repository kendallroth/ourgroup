import { Column, Entity, OneToMany } from "typeorm";

// Utilities
import { BaseEntity } from "@common/entities";
import { RefreshToken, VerificationCode } from "@modules/auth/entities";

@Entity({ name: "account" })
export class Account extends BaseEntity {
  @Column("text", { unique: true })
  email!: string;

  /** Account display/full name */
  @Column("text", { nullable: true })
  name!: string | null;

  /**
   * Account password
   *
   * NOTE: Password should NEVER be selectable (even though just a hash)!
   */
  @Column("text", { select: false })
  password!: string;

  /** When account last logged in to app */
  @Column("timestamptz", { name: "last_login_at", nullable: true })
  lastLoginAt!: Date | null;

  /** When account initially verified their account (via email) */
  @Column("timestamptz", { name: "verified_at", nullable: true })
  verifiedAt!: Date | null;

  /** Refresh tokens */
  @OneToMany(() => RefreshToken, (refreshToken: RefreshToken) => refreshToken.account)
  refreshTokens!: RefreshToken[];

  /** Verification codes */
  @OneToMany(() => VerificationCode, (code: VerificationCode) => code.account)
  verificationCodes!: VerificationCode[];
}
