import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Utilities
import { BaseEntity } from "@common/entities";
import { RefreshToken, VerificationCode } from "@modules/auth/entities";
import { GroupMember } from "@modules/group/entities";

// Types
import { AccountType } from "../types";

@Entity({ name: "account" })
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "account_id" })
  id!: string;

  @Column("text", { unique: true })
  email!: string;

  /** Account display/full name */
  @Column("text", { nullable: true })
  name!: string | null;

  /**
   * Account type (full or partial)
   *
   * Full accounts are created through registration process, while partial accounts
   *   are created when adding new members to a group (can upgrade to full account).
   */
  @Column("enum", { enum: AccountType })
  type!: AccountType;

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

  /** When account was upgraded from partial (if ever) */
  @Column("timestamptz", { name: "upgraded_at", nullable: true })
  upgradedAt!: Date | null;

  /// Relationships ////////////////////////////////////////////////////////////

  @OneToMany(() => GroupMember, (groupMember: GroupMember) => groupMember.account)
  memberships!: GroupMember[];

  /** Refresh tokens */
  @OneToMany(() => RefreshToken, (refreshToken: RefreshToken) => refreshToken.account)
  refreshTokens!: RefreshToken[];

  /** Verification codes */
  @OneToMany(() => VerificationCode, (code: VerificationCode) => code.account)
  verificationCodes!: VerificationCode[];
}
