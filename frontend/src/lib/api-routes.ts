export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  COMPETITIONS: {
    ALL: '/competition',
    JOIN: '/competition/join',
    LEADERBOARD: {
      ME: (slug: string) => `/competition/${slug}/leaderboard/me`,
    },
    PUBLIC: {
      INFO: (slug: string) => `/competition/public/${slug}`,
    },
  },
  FEEDBACK: '/',
} as const;
