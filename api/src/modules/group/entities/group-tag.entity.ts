import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

// Utilities
import { BaseEntity } from "@common/entities";

// Types
import { Group } from "./group.entity";

@Entity({ name: "group_tag" })
export class GroupTag extends BaseEntity {
  /** Tag name (must be URL-safe) */
  @PrimaryColumn("text")
  name!: string;

  /** Tag description/purpose */
  @Column("text", { nullable: true })
  description!: string | null;

  /** Tag colour (visual distinction) */
  @Column("text", { nullable: true })
  color!: string | null;

  /** "Duplicated" column for easier entity access */
  @PrimaryColumn("uuid", { name: "group_id" })
  groupId!: string;

  /** Date when tag was archived */
  @Column("timestamptz", { name: "archived_at", nullable: true })
  archivedAt!: Date | null;

  /// Relationships ////////////////////////////////////////////////////////////

  /** Tag group */
  @ManyToOne(() => Group)
  @JoinColumn({ name: "group_id" })
  group!: Group;
}
