import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// Utilities
import { UsableTokenEntity } from "@common/entities";
import { Account } from "@modules/account/entities";
import { Group } from "./group.entity";
import { GroupMember } from "./group-member.entity";
import { GroupInvitationStatus } from "../types";

@Entity({ name: "group_invitation" })
export class GroupInvitation extends UsableTokenEntity {
  /** Group invitation ID */
  @PrimaryGeneratedColumn("uuid", { name: "group_invitation_id" })
  id!: string;

  /** Invitation code */
  @Column("text", { unique: true })
  token!: string;

  /** Group membership invitation status */
  @Column("enum", { default: GroupInvitationStatus.PENDING, enum: GroupInvitationStatus })
  status!: GroupInvitationStatus;

  /** "Duplicated" column for easier entity access */
  @Column("uuid", { name: "group_member_id" })
  groupMemberId!: string;

  /// Relationships ////////////////////////////////////////////////////////////

  @ManyToOne(() => Account)
  @JoinColumn({ name: "account_id" })
  account!: Account;

  @ManyToOne(() => Group)
  @JoinColumn({ name: "group_id" })
  group!: Group;

  @OneToOne(() => GroupMember)
  @JoinColumn({ name: "group_member_id" })
  groupMember!: GroupMember;
}
