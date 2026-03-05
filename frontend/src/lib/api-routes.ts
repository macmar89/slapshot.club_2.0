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
    MATCHES: {
      LIST: (slug: string, date: string, timezone: string) =>
        `/competition/${slug}/matches?date=${date}&tz=${timezone}`,
      UPCOMING: (slug: string) => `/competition/${slug}/matches/upcoming`,
      CALENDAR: (slug: string, timeZone: string) =>
        `/competition/${slug}/matches/calendar?tz=${timeZone}`,
    },
    PUBLIC: {
      INFO: (slug: string) => `/competition/public/${slug}`,
    },
  },
  MATCHES: {
    DETAIL: {
      INFO: (id: string) => `/matches/${id}`,
      PREDICTIONS: (id: string, params?: { page?: number; limit?: number; search?: string }) => {
        const query = new URLSearchParams({
          page: String(params?.page || 1),
          limit: String(params?.limit || 3),
          ...(params?.search && { search: params.search }),
        });

        return `/matches/${id}/predictions?${query.toString()}`;
      },
    },
  },
  PREDICTION: {
    CREATE: '/prediction',
  },
  FEEDBACK: '/',
} as const;
