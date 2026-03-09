export const APP_CONFIG = {
  dashboard: {
    upcomingDaysRange: 3,
    maxMatchCards: 3,
  },
  pagination: {
    defaultLimit: 10,
  },
  groups: {
    maxMembers: {
      free: 0,
      starter: 0,
      pro: 5,
      vip: 10,
    },
    maxJoinedGroups: {
      free: 1,
      starter: 1,
      pro: 5,
      vip: 99,
    },
  },
} as const;
