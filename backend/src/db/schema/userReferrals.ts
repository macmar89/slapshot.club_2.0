import { pgTable, index, foreignKey, varchar, numeric, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { generateCuid } from '../helpers.js';

export const userReferrals = pgTable(
  'user_referrals',
  {
    id: generateCuid(),
    userId: varchar('user_id')
      .references(() => users.id)
      .notNull(),
    referralCode: varchar('referral_code').unique().notNull(),
    referredById: varchar('referred_by_id'),
    totalRegistered: numeric('total_registered').default('0'),
    totalPaid: numeric('total_paid').default('0'),
  },
  (table) => [
    uniqueIndex('user_referrals_referral_code_idx').using(
      'btree',
      table.referralCode.asc().nullsLast().op('text_ops'),
    ),
    index('user_referrals_referred_by_idx').using(
      'btree',
      table.referredById.asc().nullsLast().op('text_ops'),
    ),
    index('user_referrals_user_idx').using('btree', table.userId.asc().nullsLast().op('text_ops')),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'user_referrals_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.referredById],
      foreignColumns: [users.id],
      name: 'user_referrals_referred_by_id_fkey',
    }).onDelete('set null'),
  ],
);
