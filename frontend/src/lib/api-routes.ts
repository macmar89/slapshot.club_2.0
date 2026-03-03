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
    PUBLIC: {
      INFO: (slug: string) => `/competition/public/${slug}`,
    },
  },
  FEEDBACK: '/',
} as const;
