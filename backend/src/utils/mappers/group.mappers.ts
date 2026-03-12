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

export const mapGroupLeaderboardEntries = (entries: any[], userId: string) => {
  return entries.map((entry) => ({
    id: entry.id,
    username: entry.user?.memberships[0]?.alias?.length
      ? entry.user.memberships[0].alias
      : entry.user.username,
    memberRole: entry.user?.memberships[0]?.role,
    userId: entry.userId,
    isCurrentUser: entry.userId === userId,
    currentRank: entry.groupRank,
    globalCurrentRank: entry.currentRank,
    totalPoints: entry.totalPoints,
    totalPredictions: entry.totalPredictions,
    exactGuesses: entry.exactGuesses,
    correctTrends: entry.correctTrends,
    correctDiffs: entry.correctDiffs,
    wrongGuesses: entry.wrongGuesses,
    currentForm: entry.currentForm,
  }));
};
