import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

// Types
import { UsableTokenEntity } from "@common/entities";
import { Account } from "@modules/account/entities";

@Entity({ name: "refresh_token" })
export class RefreshToken extends UsableTokenEntity {
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
