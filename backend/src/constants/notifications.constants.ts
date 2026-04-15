import type { NotificationType } from '../types/notifications.types.js';

export const NOTIFICATION_GROUPS = {
  GAME: ['MATCH_FINISHED', 'POINTS_AWARDED', 'MATCH_REMINDER', 'DAILY_TIPS_REMINDER'],
  SOCIAL: [
    'GROUP_INVITE',
    'GROUP_INVITE_ACCEPTED',
    'GROUP_INVITE_REJECTED',
    'GROUP_PENDING',
    'GROUP_PENDING_ACCEPTED',
    'GROUP_PENDING_REJECTED',
  ],
  COMPETITION: ['NEW_COMPETITION', 'COMPETITION_STARTED', 'COMPETITION_FINISHED'],
  SYSTEM: ['SYSTEM_ALERT', 'NEW_FEATURE', 'UPDATE_SUMMARY', 'TRIAL_EXPIRING', 'NEW_ANNOUNCEMENT', 'NEW_FEEDBACK'],
  ANNOUNCEMENTS: ['NEW_ANNOUNCEMENT'],
} as const;

export enum NOTIFICATION_GROUP {
  ALL = 'ALL',
  GAME = 'GAME',
  SOCIAL = 'SOCIAL',
  COMPETITION = 'COMPETITION',
  SYSTEM = 'SYSTEM',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
}

// Flat map of type → translation keys.
// Keyed by notificationTypeEnum value so the dispatcher can look up keys at runtime.
export const NOTIFICATION_KEYS = {
  // ─── GROUP ──────────────────────────────────────────────────────────────────
  GROUP_PENDING: {
    title: 'notifications.group_pending.title',
    message: 'notifications.group_pending.message',
  },
  GROUP_PENDING_ACCEPTED: {
    title: 'notifications.group_pending_accepted.title',
    message: 'notifications.group_pending_accepted.message',
  },
  GROUP_PENDING_REJECTED: {
    title: 'notifications.group_pending_rejected.title',
    message: 'notifications.group_pending_rejected.message',
  },
  GROUP_INVITE: {
    title: 'notifications.group_invite.title',
    message: 'notifications.group_invite.message',
  },
  GROUP_INVITE_ACCEPTED: {
    title: 'notifications.group_invite_accepted.title',
    message: 'notifications.group_invite_accepted.message',
  },
  GROUP_INVITE_REJECTED: {
    title: 'notifications.group_invite_rejected.title',
    message: 'notifications.group_invite_rejected.message',
  },

  // ─── GAME ───────────────────────────────────────────────────────────────────
  MATCH_FINISHED: {
    title: 'notifications.match_finished.title',
    message: 'notifications.match_finished.message',
  },
  POINTS_AWARDED: {
    title: 'notifications.points_awarded.title',
    message: 'notifications.points_awarded.message',
  },
  MATCH_REMINDER: {
    title: 'notifications.match_reminder.title',
    message: 'notifications.match_reminder.message',
  },
  DAILY_TIPS_REMINDER: {
    title: 'notifications.daily_tips_reminder.title',
    message: 'notifications.daily_tips_reminder.message',
  },

  // ─── COMPETITION ──────────────────────────────────────────────────────────
  NEW_COMPETITION: {
    title: 'notifications.new_competition.title',
    message: 'notifications.new_competition.message',
  },
  COMPETITION_STARTED: {
    title: 'notifications.competition_started.title',
    message: 'notifications.competition_started.message',
  },
  COMPETITION_FINISHED: {
    title: 'notifications.competition_finished.title',
    message: 'notifications.competition_finished.message',
  },

  // ─── SYSTEM ──────────────────────────────────────────────────────────────
  SYSTEM_ALERT: {
    title: 'notifications.system_alert.title',
    message: 'notifications.system_alert.message',
  },
  NEW_FEATURE: {
    title: 'notifications.new_feature.title',
    message: 'notifications.new_feature.message',
  },
  UPDATE_SUMMARY: {
    title: 'notifications.update_summary.title',
    message: 'notifications.update_summary.message',
  },
  TRIAL_EXPIRING: {
    title: 'notifications.trial_expiring.title',
    message: 'notifications.trial_expiring.message',
  },
  NEW_ANNOUNCEMENT: {
    title: 'notifications.new_announcement.title',
    message: 'notifications.new_announcement.message',
  },
  NEW_FEEDBACK: {
    title: 'notifications.new_feedback.title',
    message: 'notifications.new_feedback.message',
  },
} as const;
