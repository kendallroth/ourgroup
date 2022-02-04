import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * Base entity class
 *
 * NOTE: Entity contains an auto-generated primary ID; if this behaviour is not desired,
 *         avoid inheriting from this class (and add timestamps manually)!
 */
export abstract class BaseEntity {
  /** Entity ID */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** Date entity was created */
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  /** Date entity was last updated */
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
