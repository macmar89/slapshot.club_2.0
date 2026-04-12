export const APP_CONFIG = {
  PUBLIC_PATHS: ['/', '/register', '/verify-email', '/reset-password'],
  NOTIFICATIONS: {
    PAGE_SIZE: 20,
  },
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@slapshot.club',
};
