import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// Types
import { UsableTokenEntity } from "@common/entities";
import { Account } from "@modules/account/entities";

@Entity({ name: "refresh_token" })
export class RefreshToken extends UsableTokenEntity {
  @PrimaryGeneratedColumn("uuid", { name: "token_id" })
  tokenId!: string;

  /**
   * Refresh token
   *
   * NOTE: Refresh tokens are hashed with account ID upon storage
   */
  @Column("text", { unique: true })
  token!: string;

  @Column("uuid", { name: "account_id" })
  public accountId!: string;

  /** Refresh token owner */
  @ManyToOne(() => Account, (account) => account.refreshTokens, { nullable: false })
  @JoinColumn({ name: "account_id" })
  account!: Account;
}
