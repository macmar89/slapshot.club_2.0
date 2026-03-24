import { pgEnum, pgTable, varchar, text, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { generateCuid } from '../helpers.js';

export const notificationTypeEnum = pgEnum('notification_type', [
  'MATCH_FINISHED',
  'POINTS_AWARDED',

  'GROUP_INVITE',
  'GROUP_INVITE_ACCEPTED',
  'GROUP_INVITE_REJECTED',
  'GROUP_PENDING',
  'GROUP_PENDING_ACCEPTED',
  'GROUP_PENDING_REJECTED',

  'MATCH_REMINDER',
  'DAILY_TIPS_REMINDER',

  'TRIAL_EXPIRING',
  'NEW_COMPETITION',
  'COMPETITION_FINISHED',
  'COMPETITION_STARTED',

  'SYSTEM_ALERT',
  'NEW_FEATURE',
  'UPDATE_SUMMARY',
]);

export const notifications = pgTable('notifications', {
  id: generateCuid(),
  userId: varchar('user_id', { length: 24 }),
  type: notificationTypeEnum('type').notNull(),

  titleKey: text('title_key').notNull(),
  messageKey: text('message_key').notNull(),

  payload: jsonb('payload').$type<{
    matchId?: string;
    groupId?: string;
    points?: number;
    score?: string;
  }>(),

  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
