export type GroupRole = 'owner' | 'admin' | 'member';

export interface GroupRequest {
  groupId: string;
  memberRole: GroupRole;
}
