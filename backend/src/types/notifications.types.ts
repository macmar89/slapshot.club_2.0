import type { NOTIFICATION_GROUPS } from '../constants/notifications.constants.js';
import type { notificationTypeEnum } from '../db/schema/notifications.js';

export interface NotificationPayload {
  matchId?: string;
  groupId?: string;
  groupName?: string;
  points?: number;
  score?: string;
  screen?: string;
  requestingUserId?: string;
  username?: string;
  groupSlug?: string;
  competitionSlug?: string;
  competitionName?: string;
}

export type NotificationGroup = (typeof NOTIFICATION_GROUPS)[keyof typeof NOTIFICATION_GROUPS];

export type NotificationType = (typeof notificationTypeEnum.enumValues)[number];

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  titleKey: string;
  messageKey: string;
  payload?: NotificationPayload;
}

export interface PushNotificationData {
  titleKey: string;
  messageKey: string;
  payload?: NotificationPayload;
}

// ─── notify() dispatcher params ──────────────────────────────────────────────

export interface NotifyParams {
  /** Single recipient. */
  userId?: string;
  /** Multiple recipients — triggers bulkCreate for in-app. */
  userIds?: string[];
  type: NotificationType;
  payload?: NotificationPayload;
}
