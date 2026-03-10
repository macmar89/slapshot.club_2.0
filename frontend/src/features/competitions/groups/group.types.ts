export interface UserGroupsResponse {
  data: UserGroup[];
  metadata: UserGroupsMetadata;
}

export type GroupType = 'private' | 'vip' | 'business' | 'pub' | 'partner';

export type GroupMemberRole = 'owner' | 'admin' | 'member';

export type GroupStatus = 'active' | 'warning' | 'locked';

export type GroupMemberStatus = 'pending' | 'invited' | 'active' | 'rejecte' | 'banned';

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
