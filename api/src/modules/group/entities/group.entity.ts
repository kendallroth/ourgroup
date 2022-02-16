import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Utilities
import { BaseEntity } from "@common/entities";
import { Account } from "@modules/account/entities";
import { GroupTag } from "./group-tag.entity";
import { GroupMember } from "./group-member.entity";

// Types
import { GroupApplicationStatus } from "../types";

@Entity({ name: "group" })
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "group_id" })
  id!: string;

  /** Group URL (unique web identifier) */
  @Column("text", { unique: true })
  slug!: string;

  /** Group display name */
  @Column("text")
  name!: string;

  /** Group description/purpose */
  @Column("text", { nullable: true })
  description!: string | null;

  /** Group colour (visual distinction) */
  @Column("text")
  color!: string;

  /** "Duplicated" column for easier entity access */
  @Column("uuid", { name: "creator_account_id" })
  creatorId!: string;

  /** Group application status */
  @Column("enum", {
    default: GroupApplicationStatus.PENDING,
    enum: GroupApplicationStatus,
    name: "application_status",
  })
  applicationStatus!: GroupApplicationStatus;

  /** Date when group application was handled (approved/rejected) */
  @Column("timestamptz", { name: "application_handled_at", nullable: true })
  applicationHandledAt!: Date | null;

  /** Date when group was temporarily disabled */
  @Column("timestamptz", { name: "disabled_at", nullable: true })
  disabledAt!: Date | null;

  /** Date when group was archived */
  @Column("timestamptz", { name: "archived_at", nullable: true })
  archivedAt!: Date | null;

  /// Relationships ////////////////////////////////////////////////////////////

  @ManyToOne(() => Account)
  @JoinColumn({ name: "creator_account_id" })
  creator!: Account;

  @OneToMany(() => GroupMember, (groupMember: GroupMember) => groupMember.group)
  members!: GroupMember[];

  @OneToMany(() => GroupTag, (groupTag: GroupTag) => groupTag.group)
  tags!: GroupTag[];
}
