import { SUBSCRIPTION_CONFIG } from './subscription.config.js';

export const APP_CONFIG = {
  SUPPORT_EMAIL: 'support@slapshot.club',
  DASHBOARD: {
    UPCOMING_DAYS_RANGE: 3,
    MAX_MATCH_CARDS: 3,
  },
  PAGINATION: {
    DEFAULT_LIMIT: 10,
  },
  POINTS: {
    EXACT: 5,
    TREND: 2,
    DIFF: 3,
    WRONG: 0,
  },
  GROUPS: {
    ELIGIBLE_FOR_OWNERSHIP: [SUBSCRIPTION_CONFIG.PLANS.PRO, SUBSCRIPTION_CONFIG.PLANS.VIP],

    CAN_CREATE_GROUPS: [
      SUBSCRIPTION_CONFIG.PLANS.STARTER,
      SUBSCRIPTION_CONFIG.PLANS.PRO,
      SUBSCRIPTION_CONFIG.PLANS.VIP,
    ],

    MAX_GROUP_MEMBERS: {
      private: 30,
      business: 50,
      vip: 100,
    },
    MEMBER_CAPACITY_BOOST: {
      free: 0,
      starter: 0,
      pro: 5,
      vip: 10,
    },
    MAX_CREATED_PRIVATE_GROUPS: {
      free: 0,
      starter: 1,
      pro: 2,
      vip: 5,
    },
    MAX_JOINED_PRIVATE_GROUPS: {
      free: 1,
      starter: 2,
      pro: 5,
      vip: 10,
    },
  },
} as const;
