import { pgEnum, pgTable, timestamp, varchar, foreignKey, text, index } from 'drizzle-orm/pg-core';
import { generateCuid, withUpdatesFields } from '../helpers.js';
import { users } from './users.js';

export const enumUsersSubscriptionPlan = pgEnum('enum_users_subscription_plan', [
  'free',
  'starter',
  'pro',
  'vip',
]);
export const enumUsersSubscriptionPlanType = pgEnum('enum_users_subscription_plan_type', [
  'seasonal',
  'lifetime',
]);
export const enumUsersSubscriptionStatus = pgEnum('enum_subscription_status', [
  'active',
  'expired',
  'cancelled',
]);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: generateCuid(),
    userId: varchar('user_id', { length: 24 }).notNull(),
    plan: enumUsersSubscriptionPlan('plan').default('free').notNull(),
    planType: enumUsersSubscriptionPlanType('plan_type').default('seasonal').notNull(),
    status: enumUsersSubscriptionStatus('status').default('active').notNull(),
    activeFrom: timestamp('active_from', { precision: 3, withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
    activeUntil: timestamp('active_until', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    paymentId: text('payment_id'),
    ...withUpdatesFields,
  },
  (table) => [
    index('subscriptions_user_id_idx').on(table.userId),
    index('subscriptions_active_until_idx').on(table.activeUntil),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'subscriptions_user_id_fkey',
    }).onDelete('cascade'),
  ],
);
