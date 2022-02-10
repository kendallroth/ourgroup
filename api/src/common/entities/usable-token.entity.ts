import { Column, PrimaryGeneratedColumn } from "typeorm";

// Types
import { BaseEntity } from "./base.entity";

/**
 * Base class for usable tokens
 *
 * NOTE: Provides fields for invalidation, expiry, and usage
 */
export abstract class UsableTokenEntity extends BaseEntity {
  /** Token ID */
  @PrimaryGeneratedColumn("uuid", { name: "token_id" })
  tokenId!: string;

  /** Date when token was deactivated */
  @Column("timestamptz", { name: "invalidated_at", nullable: true })
  invalidatedAt!: Date | null;

  /** Date when token expires and is no longer valid */
  @Column("timestamptz", { name: "expires_at" })
  expiresAt!: Date;

  /** Date when token was used */
  @Column("timestamptz", { name: "used_at", nullable: true })
  usedAt!: Date | null;
}
