export const mapGroupMembers = (members: any[], userId: string) => {
  return members.map((m) => ({
    id: m.id,
    status: m.status,
    userId: m.user.id,
    isMe: m.user.id === userId,
    memberName: m.alias?.length ? m.alias : m.user.username,
    username: m.user.username,
    alias: m.alias,
    subscriptionPlan: m.user.subscriptionPlan,
    memberRole: m.role,
    joinedAt: m.joinedAt,
  }));
};
