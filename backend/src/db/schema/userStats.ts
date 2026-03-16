import { pgTable, index, foreignKey, varchar, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';
import { generateCuid } from '../helpers';

export const userStats = pgTable(
  'user_stats',
  {
    id: generateCuid(),
    userId: varchar('user_id').notNull(),
    lifetimePoints: integer('lifetime_points').notNull().default(0),
    lifetimePossiblePoints: integer('lifetime_possible_points').notNull().default(0),
    totalPredictions: integer('total_predictions').notNull().default(0),
    lifeTimeExactGuesses: integer('life_time_exact_guesses').default(0),
    lifeTimeCorrectTrends: integer('life_time_correct_trends').default(0),
    lifeTimeCorrectDiffs: integer('life_time_correct_diffs').default(0),
    lifeTimeWrongGuesses: integer('life_time_wrong_guesses').default(0),
    currentOvr: integer('current_ovr').notNull().default(0),
    maxOvrEver: integer('max_ovr_ever').notNull().default(0),
  },
  (table) => [
    uniqueIndex('user_stats_user_id_unique').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    index('user_stats_user_id_idx').using('btree', table.userId.asc().nullsLast().op('text_ops')),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'user_stats_user_id_fkey',
    }).onDelete('cascade'),
  ],
);
