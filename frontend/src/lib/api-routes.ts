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
  },
  FEEDBACK: '/',
} as const;
