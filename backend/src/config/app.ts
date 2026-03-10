export const APP_CONFIG = {
  dashboard: {
    upcomingDaysRange: 3,
    maxMatchCards: 3,
  },
  pagination: {
    defaultLimit: 10,
  },
  groups: {
    maxGroupMembers: {
      private: 30,
      business: 50,
      vip: 100,
    },
    memberCapacityBoost: {
      free: 0,
      starter: 0,
      pro: 5,
      vip: 10,
    },
    maxCreatedPrivateGroups: {
      free: 0,
      starter: 1,
      pro: 2,
      vip: 5,
    },
    maxJoinedPrivateGroups: {
      free: 1,
      starter: 2,
      pro: 5,
      vip: 10,
    },
  },
} as const;
