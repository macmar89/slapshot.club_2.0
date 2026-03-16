import {
  pgTable,
  index,
  varchar,
  timestamp,
  uniqueIndex,
  boolean,
  pgEnum,
  text,
  integer,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { generateCuid, withUpdatesFields } from '../helpers.js';
import { enumUsersSubscriptionPlan } from './subscriptions.js';

export const enumUsersPreferredLanguage = pgEnum('enum_users_preferred_language', [
  'sk',
  'en',
  'cs',
]);

export const enumUsersRole = pgEnum('enum_users_role', ['admin', 'editor', 'user', 'demo']);

export const users = pgTable(
  'users',
  {
    id: generateCuid(),
    username: varchar('username', { length: 100 }).unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: text('password').notNull(),
    role: enumUsersRole().default('user').notNull(),

    lastActiveAt: timestamp('last_active_at', { precision: 3, withTimezone: true, mode: 'string' }),

    preferredLanguage: enumUsersPreferredLanguage('preferred_language').default('sk'),

    subscriptionPlan: enumUsersSubscriptionPlan('subscription_plan').default('free').notNull(),
    subscriptionActiveUntil: timestamp('subscription_active_until', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }),

    resetPasswordToken: varchar('reset_password_token'),
    resetPasswordExpiration: timestamp('reset_password_expiration', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }),

    verifiedAt: timestamp('verified_at', { precision: 3, withTimezone: true, mode: 'string' }),
    verificationToken: varchar('verification_token'),

    isActive: boolean('is_active').default(true).notNull(),

    referralCode: varchar('referral_code').unique().notNull(),
    referredById: varchar('referred_by_id', { length: 24 }).references(
      (): AnyPgColumn => users.id,
      {
        onDelete: 'set null',
      },
    ),
    totalRegistered: integer('total_registered').default(0),
    totalPaid: integer('total_paid').default(0),

    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('users_email_idx').on(table.email),
    uniqueIndex('users_username_idx').on(table.username),
    uniqueIndex('users_referral_code_idx').on(table.referralCode),
    index('users_subscription_active_until_idx').on(table.subscriptionActiveUntil),
    index('users_created_at_idx').on(table.createdAt),
    index('users_updated_at_idx').on(table.updatedAt),
    index('users_referred_by_idx').on(table.referredById),
  ],
);
