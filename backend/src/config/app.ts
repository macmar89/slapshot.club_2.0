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
  },
} as const;
