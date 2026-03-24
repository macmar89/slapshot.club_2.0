import type { NotificationType } from '../types/notifications.types.js';

// ─── Channel types ───────────────────────────────────────────────────────────
export type NotificationChannel = 'in-app' | 'push' | 'email';

// ─── Notification config ─────────────────────────────────────────────────────
// Add one line here when you add a new notification type.
// channels: which delivery channels this type uses.

export const NOTIFICATION_CONFIG: Record<NotificationType, { channels: NotificationChannel[] }> = {
  // ─ Group ─────────────────────────────────────────────────────────────────
  GROUP_PENDING: { channels: ['in-app', 'push'] },
  GROUP_PENDING_ACCEPTED: { channels: ['in-app', 'push'] },
  GROUP_PENDING_REJECTED: { channels: ['in-app', 'push'] },
  GROUP_INVITE: { channels: ['in-app', 'push'] },
  GROUP_INVITE_ACCEPTED: { channels: ['in-app', 'push'] },
  GROUP_INVITE_REJECTED: { channels: ['in-app', 'push'] },

  // ─ Game ──────────────────────────────────────────────────────────────────
  MATCH_FINISHED: { channels: ['in-app', 'push'] },
  POINTS_AWARDED: { channels: ['in-app', 'push'] },
  MATCH_REMINDER: { channels: ['in-app', 'push'] },
  DAILY_TIPS_REMINDER: { channels: ['in-app', 'push'] },

  // ─ Competition ───────────────────────────────────────────────────────────
  NEW_COMPETITION: { channels: ['in-app', 'push'] },
  COMPETITION_STARTED: { channels: ['in-app', 'push'] },
  COMPETITION_FINISHED: { channels: ['in-app', 'push'] },

  // ─ System ────────────────────────────────────────────────────────────────
  SYSTEM_ALERT: { channels: ['in-app'] },
  NEW_FEATURE: { channels: ['in-app'] },
  UPDATE_SUMMARY: { channels: ['in-app'] },
  TRIAL_EXPIRING: { channels: ['in-app', 'push', 'email'] },
};
