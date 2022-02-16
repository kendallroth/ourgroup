import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

// Utilities
import { BaseEntity } from "@common/entities";
import { Account } from "@modules/account/entities";
import { Group } from "./group.entity";

// Types
import { GroupMemberRole } from "../types";

@Entity({ name: "group_member" })
export class GroupMember extends BaseEntity {
  /** Group membership ID (not account ID!) */
  @PrimaryColumn("uuid", { name: "group_member_id" })
  id!: string;

  /** "Duplicated" column for easier entity access */
  @Column("uuid", { name: "account_id" })
  accountId!: string;

  /** "Duplicated" column for easier entity access */
  @Column("uuid", { name: "group_id" })
  groupId!: string;

  /** Group member role */
  @Column("enum", { default: GroupMemberRole.MEMBER, enum: GroupMemberRole })
  role!: GroupMemberRole;

  /** Group member tag IDs */
  @Column("text", { array: true, nullable: true })
  tagIds!: string[] | null;

  /** Date when member was removed from group */
  @Column("timestamptz", { name: "removed_at", nullable: true })
  removedAt!: Date | null;

  /// Relationships ////////////////////////////////////////////////////////////

  @ManyToOne(() => Account)
  @JoinColumn({ name: "account_id" })
  account!: Account;

  @ManyToOne(() => Group)
  @JoinColumn({ name: "group_id" })
  group!: Group;
}
