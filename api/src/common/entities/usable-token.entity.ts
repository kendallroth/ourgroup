import { Column } from "typeorm";

// Types
import { BaseEntity } from "./base.entity";

/**
 * Base class for usable tokens
 *
 * NOTE: Provides fields for invalidation, expiry, and usage
 */
export abstract class UsableTokenEntity extends BaseEntity {
  /**
   * Usable token ID
   *
   * NOTE: Must be overridden according to the needs of each inheriting child,
   *         which should also specify a custom database column name.
   */
  abstract id: string;

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
