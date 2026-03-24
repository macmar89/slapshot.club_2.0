export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    CHECK_AVAILABILITY: '/auth/check-availability',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    UPDATE_PREFERRED_LANGUAGE: '/user/preferred-language',
    UPDATE_USERNAME: '/user/username',
    CHANGE_PASSWORD: '/user/change-password',
    EMAIL_CHANGE_REQUEST: '/user/email-change-request',
  },
  COMPETITIONS: {
    ALL: '/competition',
    JOIN: '/competition/join',

    LEADERBOARD: {
      LIST: (slug: string) => `/competition/${slug}/leaderboard`,
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
    PLAYER: {
      STATS: (slug: string, username: string) => `/competition/${slug}/player/${username}/stats`,
      PREDICTIONS: (slug: string, username: string) =>
        `/competition/${slug}/player/${username}/predictions`,
    },
    TEAMS: (slug: string) => `/competition/${slug}/teams`,
  },
  FEEDBACK: '/feedback',
  GROUPS: {
    CREATE: `/groups`,
    DETAIL: {
      INFO: (slug: string) => `/groups/${slug}`,
      LEADERBOARD: (slug: string) => `/groups/${slug}/leaderboard`,
      MEMBERS: {
        LIST: (slug: string) => `/groups/${slug}/members`,
        STATUS: (slug: string, memberId: string) => `/groups/${slug}/members/${memberId}/status`,
        ROLE: (slug: string, memberId: string) => `/groups/${slug}/members/${memberId}/role`,
        DELETE: (slug: string, memberId: string) => `/groups/${slug}/members/${memberId}`,
      },
      SETTINGS: (slug: string) => `/groups/${slug}/settings`,
      TRANSFER_OWNERSHIP: (slug: string) => `/groups/${slug}/transfer-ownership`,
    },
    JOIN: `/groups/join`,
    USER_GROUPS_BY_COMPETITION_SLUG: (slug: string) => `/groups/competition/${slug}`,
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
  NOTIFICATIONS: {
    ALL: (limit: number = 10, group: string = 'ALL') =>
      `/notifications?limit=${limit}&group=${group}`,
    UNREAD_COUNT: '/notifications/unread-count',
    READ_ALL: '/notifications/read/all',
    READ_ONE: (id: string) => `/notifications/read/${id}`,
    STREAM: '/notifications/stream',
  },
} as const;
