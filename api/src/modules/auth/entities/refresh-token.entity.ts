import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// Types
import { UsableTokenEntity } from "@common/entities";
import { Account } from "@modules/account/entities";

@Entity({ name: "refresh_token" })
export class RefreshToken extends UsableTokenEntity {
  /** Refresh token ID */
  @PrimaryGeneratedColumn("uuid", { name: "refresh_token_id" })
  id!: string;

  /**
   * Refresh token
   *
   * NOTE: Refresh tokens are hashed with account ID upon storage
   */
  @Column("text", { unique: true })
  token!: string;

  /** "Duplicated" column for easier entity access */
  @Column("uuid", { name: "account_id" })
  accountId!: string;

  /// Relationships ////////////////////////////////////////////////////////////

  /** Refresh token owner */
  @ManyToOne(() => Account, (account) => account.refreshTokens, { nullable: false })
  @JoinColumn({ name: "account_id" })
  account!: Account;
}
