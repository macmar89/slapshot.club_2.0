import { SubscriptionPlan } from '@/features/users/users.types';

export interface UserGroupsResponse {
  data: UserGroup[];
  metadata: UserGroupsMetadata;
}

export type GroupType = 'private' | 'vip' | 'business' | 'pub' | 'partner';

export type GroupMemberRole = 'owner' | 'admin' | 'member';

export type GroupStatus = 'active' | 'warning' | 'locked';

export type GroupMemberStatus = 'pending' | 'invited' | 'active' | 'rejected' | 'banned';

export interface UserGroup {
  id: string;
  name: string;
  slug: string;
  type: GroupType;
  code: string;
  role: GroupMemberRole;
  maxMembers: number;
  memberCount: number;
  status: GroupStatus;
  warningExpiresAt: string | null;
  groupMemberStatus: GroupMemberStatus;
  pendingMembersCount: number;
  createdAt: string;
}

export interface UserGroupsMetadata {
  canCreateMore: boolean;
  canJoinMore: boolean;
  maxOwned: number;
  maxJoined: number;
  currentOwned: number;
  currentJoined: number;
  isOverLimit: boolean;
}

export interface GroupDetail {
  id: string;
  name: string;
  code: string;
  type: GroupType;
  maxMembers: number;
  statsMembersCount: number;
  statsPendingMembersCount: number;
  absoluteMaxCapacity: number;
  status: GroupStatus;
  currentUserRole: GroupMemberRole;
  warningExpiresAt: string | null;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  status: GroupMemberStatus;
  userId: string;
  isMe: boolean;
  memberName: string;
  username: string;
  alias: string | null;
  subscriptionPlan: SubscriptionPlan;
  memberRole: GroupMemberRole;
  joinedAt: string;
}

export interface GroupMembersResponse {
  active: GroupMember[];
  pending: GroupMember[];
  banned: GroupMember[];
  invited: GroupMember[];
  rejected: GroupMember[];
}

export interface GroupDetailSettings {
  code: string;
  status: GroupStatus;
  warningExpiresAt: string | null;
  maxMembers: number;
  statsMembersCount: number;
  isAliasRequired: boolean;
  absoluteMaxCapacity: number;
  createdAt: string;
  isLocked: boolean;
  requireApproval: boolean;
  allowMemberInvites: boolean;
}
