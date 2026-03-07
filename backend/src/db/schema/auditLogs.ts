import { pgTable, text, timestamp, jsonb, pgEnum, index, varchar } from 'drizzle-orm/pg-core';
import { generateCuid } from '../helpers';

export const auditActionEnum = pgEnum('audit_action', [
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'REGISTER_SUCCESS',
  'LOGOUT',
  'PASSWORD_CHANGE',
  'PREDICTIONS_UPDATE',
  'SUB_PLAN_CHANGE',
  'COMP_JOIN',
  'PAYMENT_SUCCESS',
  'PAYMENT_FAILED',
  'COMP_LEAVE',
  'CREDIT_REFUND',
  'EMAIL_VERIFIED',
  'USERNAME_CHANGE',
  'EMAIL_CHANGE_REQUEST',
]);

export const entityTypeEnum = pgEnum('entity_type', [
  'user',
  'subscription',
  'competition',
  'auth',
  'prediction',
  'match',
  'team',
  'leaderboard',
]);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: generateCuid(),

    userId: varchar('user_id', { length: 24 }),

    action: auditActionEnum('action').notNull(),
    entityType: entityTypeEnum('entity_type').notNull(),
    entityId: varchar('entity_id', { length: 255 }),

    metadata: jsonb('metadata'),

    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('audit_logs_created_at_idx').on(table.createdAt),
    index('audit_logs_user_id_idx').on(table.userId),
    index('audit_logs_action_idx').on(table.action),
    index('audit_logs_entity_idx').on(table.entityType, table.entityId),
  ],
);
