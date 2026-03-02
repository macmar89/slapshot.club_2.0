import {
  pgTable,
  index,
  foreignKey,
  varchar,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const enumFeedbackStatus = pgEnum('enum_feedback_status', [
  'new',
  'in-progress',
  'resolved',
  'ignored',
]);

export const enumFeedbackType = pgEnum('enum_feedback_type', [
  'bug',
  'idea',
  'change_user_email_request',
  'custom_country_request',
  'other',
]);

export const feedback = pgTable(
  'feedback',
  {
    id: generateCuid(),

    type: enumFeedbackType().default('idea').notNull(),

    message: varchar().notNull(),

    pageUrl: varchar('page_url', { length: 255 }),

    userId: varchar('user_id', { length: 24 }),

    read: boolean().default(false).notNull(),
    status: enumFeedbackStatus().default('new').notNull(),

    ...withUpdatesFields,
  },
  (table) => [
    index('feedback_created_at_idx').on(table.createdAt),
    index('feedback_user_idx').on(table.userId),
    index('feedback_status_idx').on(table.status),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'feedback_user_id_fkey',
    }).onDelete('set null'),
  ],
);
