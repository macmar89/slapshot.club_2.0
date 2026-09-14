import {
  pgTable,
  index,
  foreignKey,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { competitions } from './competitions.js';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const monthlyPeriodStatusEnum = pgEnum('monthly_period_status', ['open', 'closed']);

export const monthlyLeaderboardPeriods = pgTable(
  'monthly_leaderboard_periods',
  {
    id: generateCuid(),
    competitionId: varchar('competition_id').notNull(),
    periodYear: integer('period_year').notNull(),
    periodMonth: integer('period_month').notNull(),

    status: monthlyPeriodStatusEnum('status').default('open').notNull(),

    totalParticipants: integer('total_participants').default(0).notNull(),
    totalPlayedMatches: integer('total_played_matches').default(0).notNull(),
    totalPossiblePoints: integer('total_possible_points').default(0).notNull(),

    winnerUserId: varchar('winner_user_id'),

    lastRecalculatedAt: timestamp('last_recalculated_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }),
    closedAt: timestamp('closed_at', { precision: 3, withTimezone: true, mode: 'string' }),

    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('monthly_period_competition_period_idx').on(
      table.competitionId,
      table.periodYear,
      table.periodMonth,
    ),
    index('monthly_period_status_idx').on(table.status),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'monthly_leaderboard_periods_competition_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.winnerUserId],
      foreignColumns: [users.id],
      name: 'monthly_leaderboard_periods_winner_user_id_fkey',
    }).onDelete('set null'),
  ],
);
