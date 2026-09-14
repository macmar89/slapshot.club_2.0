import {
  pgTable,
  index,
  foreignKey,
  varchar,
  integer,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { competitions } from './competitions.js';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const monthlyLeaderboardEntries = pgTable(
  'monthly_leaderboard_entries',
  {
    id: generateCuid(),
    userId: varchar('user_id').notNull(),
    competitionId: varchar('competition_id').notNull(),
    periodYear: integer('period_year').notNull(),
    periodMonth: integer('period_month').notNull(),

    totalPoints: integer('total_points').default(0).notNull(),
    totalPredictions: integer('total_predictions').default(0).notNull(),
    exactGuesses: integer('exact_guesses').default(0).notNull(),
    correctTrends: integer('correct_trends').default(0).notNull(),
    correctDiffs: integer('correct_diffs').default(0).notNull(),
    wrongGuesses: integer('wrong_guesses').default(0).notNull(),

    currentRank: integer('current_rank').default(0).notNull(),
    previousRank: integer('previous_rank').default(0).notNull(),
    rankChange: integer('rank_change').default(0).notNull(),

    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('monthly_leaderboard_user_competition_period_idx').on(
      table.userId,
      table.competitionId,
      table.periodYear,
      table.periodMonth,
    ),
    index('monthly_leaderboard_period_points_idx').on(
      table.competitionId,
      table.periodYear,
      table.periodMonth,
      table.totalPoints,
    ),
    index('monthly_leaderboard_user_idx').on(table.userId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'monthly_leaderboard_entries_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'monthly_leaderboard_entries_competition_id_fkey',
    }).onDelete('cascade'),
    check('monthly_leaderboard_period_month_check', sql`${table.periodMonth} between 1 and 12`),
  ],
);
