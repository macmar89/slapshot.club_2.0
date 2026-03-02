import {
  pgTable,
  index,
  foreignKey,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { competitions } from './competitions.js';
import { leagues } from './leagues.js';
import { users } from './users.js';
import { withUpdatesFields } from '../helpers.js';
import { sql } from 'drizzle-orm';

export const leaderboardEntries = pgTable(
  'leaderboard_entries',
  {
    id: varchar().primaryKey().notNull(),
    userId: varchar('user_id').notNull(),
    competitionId: varchar('competition_id').notNull(),
    seasonYear: integer('season_year').notNull(),

    totalPoints: integer('total_points').default(0),
    totalMatches: integer('total_matches').default(0),
    exactGuesses: integer('exact_guesses').default(0),
    correctTrends: integer('correct_trends').default(0),
    correctDiffs: integer('correct_diffs').default(0),
    wrongGuesses: integer('wrong_guesses').default(0),
    currentForm: varchar('current_form', { length: 5 }).default(''),

    currentRank: integer('current_rank'),
    previousRank: integer('previous_rank'),
    rankChange: integer('rank_change'),

    activeLeagueId: varchar('active_league_id'),

    ovr: integer().default(0),

    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('leaderboard_user_competition_season_idx').on(
      table.userId,
      table.competitionId,
      table.seasonYear,
    ),
    index('leaderboard_competition_points_idx').on(table.competitionId, table.totalPoints),
    index('leaderboard_user_idx').on(table.userId),
    index('leaderboard_current_rank_idx').on(table.currentRank),
    index('leaderboard_active_league_idx').on(table.activeLeagueId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'leaderboard_entries_user_id_fkey',
    }).onDelete('cascade'),

    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'leaderboard_entries_competition_id_fkey',
    }).onDelete('cascade'),

    foreignKey({
      columns: [table.activeLeagueId],
      foreignColumns: [leagues.id],
      name: 'leaderboard_entries_active_league_id_fkey',
    }).onDelete('set null'),
    check('current_form_check', sql`${table.currentForm} ~ '^[ESWL]*$'`),
  ],
);
