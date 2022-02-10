import { CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
 * Base entity class
 *
 * NOTE: Entity does not contain an ID field as the pseudo-standard "id"
 *         identifier name conveys no meaning apart from its entity, and
 *         leads to decreased readability in code/database queries.
 */
export abstract class BaseEntity {
  /** Date entity was created */
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  /** Date entity was last updated */
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
