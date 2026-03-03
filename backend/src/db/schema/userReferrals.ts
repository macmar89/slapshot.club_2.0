import {
  pgTable,
  index,
  foreignKey,
  varchar,
  numeric,
  uniqueIndex,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const userReferrals = pgTable(
  'user_referrals',
  {
    id: generateCuid(),
    referrerId: varchar('referrer_id', { length: 24 }).notNull(),
    referredUserId: varchar('referred_user_id', { length: 24 }).notNull(),

    hasConvertedToPro: boolean('has_converted_to_pro').default(false).notNull(),
    convertedAt: timestamp('converted_at', { precision: 3, withTimezone: true, mode: 'string' }),

    ...withUpdatesFields,
  },
  (table) => [
    index('user_referrals_referrer_idx').on(table.referrerId),
    index('user_referrals_referred_user_idx').on(table.referredUserId),
    index('user_referrals_referrer_pro_idx').on(table.referrerId, table.hasConvertedToPro),
    foreignKey({
      columns: [table.referrerId],
      foreignColumns: [users.id],
      name: 'user_referrals_referrer_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.referredUserId],
      foreignColumns: [users.id],
      name: 'user_referrals_referred_user_id_fkey',
    }).onDelete('cascade'),
  ],
);
