import { notificationsRepository } from '../repositories/notifications.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { emailQueue } from '../queues/email.queue.js';
import { getNotificationSettings } from '../features/notifications/index.js';
import { logger } from '../utils/logger.js';
import { NOTIFICATION_KEYS } from '../constants/notifications.constants.js';
import { NOTIFICATION_CONFIG } from '../constants/notifications.config.js';
import type {
  NotifyParams,
  PushNotificationData,
  CreateNotificationData,
  NotificationType,
} from '../types/notifications.types.js';
import type { Response } from 'express';

// ─── SSE Connections ──────────────────────────────────────────────────────────
export const connectedClients = new Map<string, Set<Response>>();

export const sendSSEEvent = (userId: string, eventType: string, data: any) => {
  const clients = connectedClients.get(userId);
  if (clients) {
    clients.forEach((client) => {
      try {
        client.write(`event: ${eventType}\n`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (err) {
        logger.error({ err, userId }, '[SSE] Failed to write to client');
      }
    });
  }
};

// ─── Push notification stub ───────────────────────────────────────────────────
// TODO: When push tokens are stored in the schema (e.g. user.pushToken),
// fetch the token here and send via your push provider (FCM / APNs / Expo).

const sendPushNotification = async (userId: string, data: PushNotificationData): Promise<void> => {
  logger.info({ userId, titleKey: data.titleKey }, '[Push] queued (stub)');
};

// ─── Email notification ────────────────────────────────────────────────────────
// Only DAILY_TIPS_REMINDER is wired to real sending for now — every other type
// stays a stub until they get their own template + settings key.

const sendEmailNotification = async (
  userId: string,
  type: NotificationType,
  data: PushNotificationData,
): Promise<void> => {
  if (type === 'DAILY_TIPS_REMINDER') {
    const settings = await getNotificationSettings(userId);
    if (!settings.dailyTipsReminder.email) {
      return;
    }

    const user = await userRepository.getEmailAndLocaleById(userId);
    if (!user) {
      logger.warn({ userId }, '[Email] Skipping daily tips reminder — user not found');
      return;
    }

    await emailQueue.add('daily-missing-tips-email', {
      type: 'daily-missing-tips-email',
      data: {
        to: user.email,
        locale: user.preferredLanguage ?? 'sk',
        missingTipsCount: data.payload?.missingTipsCount ?? 0,
      },
    });
    return;
  }

  logger.info({ userId, titleKey: data.titleKey }, '[Email] queued (stub)');
};

// ─── Universal dispatcher ─────────────────────────────────────────────────────

/**
 * notify() — Universal notification dispatcher.
 *
 * Looks up translation keys and delivery channels for the given type, then:
 *   • in-app  → DB insert (always blocking, awaited)
 *   • push    → fire-and-forget
 *   • email   → fire-and-forget
 *
 * Usage:
 *   // Single recipient
 *   await notify({ userId: 'abc', type: 'GROUP_PENDING_ACCEPTED', payload: { groupId } });
 *
 *   // Multiple recipients (bulk in-app insert)
 *   await notify({ userIds: ['a', 'b', 'c'], type: 'GROUP_PENDING', payload: { groupId } });
 */
export const notify = async (params: NotifyParams): Promise<void> => {
  const { type, payload } = params;

  const keys = NOTIFICATION_KEYS[type];

  if (!keys) {
    logger.warn({ type }, '[Notify] No NOTIFICATION_KEYS entry for type — skipping');
    return;
  }

  const config = NOTIFICATION_CONFIG[type];
  const channels = config?.channels ?? ['in-app'];

  const recipients = params.userIds ?? (params.userId ? [params.userId] : []);

  if (recipients.length === 0) {
    logger.warn({ type }, '[Notify] No recipients provided — skipping');
    return;
  }

  const notificationData: CreateNotificationData[] = recipients.map((userId) => ({
    userId,
    type,
    titleKey: keys.title,
    messageKey: keys.message,
    ...(payload !== undefined ? { payload } : {}),
  }));

  // ── In-App (blocking) ──────────────────────────────────────────────────────
  if (channels.includes('in-app')) {
    try {
      if (notificationData.length === 1) {
        await notificationsRepository.create(notificationData[0]!);
        sendSSEEvent(notificationData[0]!.userId, 'new-notification', { timestamp: Date.now() });
      } else {
        await notificationsRepository.bulkCreate(notificationData);
        for (const notif of notificationData) {
          sendSSEEvent(notif.userId, 'new-notification', { timestamp: Date.now() });
        }
      }
    } catch (err) {
      logger.error({ err, type, recipients }, '[Notify] Failed to persist in-app notification');
      throw err;
    }
  }

  const pushData: PushNotificationData = {
    titleKey: keys.title,
    messageKey: keys.message,
    ...(payload !== undefined ? { payload } : {}),
  };

  // ── Push (fire-and-forget) ─────────────────────────────────────────────────
  if (channels.includes('push')) {
    for (const userId of recipients) {
      sendPushNotification(userId, pushData).catch((err) =>
        logger.error({ err, userId, type }, '[Notify] Failed to send push notification'),
      );
    }
  }

  // ── Email (fire-and-forget) ────────────────────────────────────────────────
  if (channels.includes('email')) {
    for (const userId of recipients) {
      sendEmailNotification(userId, type, pushData).catch((err) =>
        logger.error({ err, userId, type }, '[Notify] Failed to send email notification'),
      );
    }
  }

  logger.info({ type, recipientCount: recipients.length, channels }, '[Notify] dispatched');
};
