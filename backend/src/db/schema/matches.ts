import {
  pgTable,
  index,
  foreignKey,
  varchar,
  timestamp,
  pgEnum,
  integer,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';
import { competitions } from './competitions.js';
import { teams } from './teams.js';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const enumMatchesResultEndingType = pgEnum('enum_matches_result_ending_type', [
  'regular',
  'ot',
  'so',
]);

export const enumMatchesStageType = pgEnum('enum_matches_stage_type', [
  'regular_season',
  'group_phase',
  'playoffs',
  'pre_season',
  'relegation',
  'promotion',
]);

export const enumMatchesStatus = pgEnum('enum_matches_status', [
  'scheduled',
  'live',
  'finished',
  'cancelled',
]);

export const matches = pgTable(
  'matches',
  {
    id: generateCuid(),

    displayTitle: varchar('display_title', { length: 255 }),

    competitionId: varchar('competition_id', { length: 24 }).notNull(),
    homeTeamId: varchar('home_team_id', { length: 24 }).notNull(),
    awayTeamId: varchar('away_team_id', { length: 24 }).notNull(),

    date: timestamp('date', { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
    status: enumMatchesStatus('status').default('scheduled').notNull(),

    homePredictedCount: integer('home_predicted_count').default(0).notNull(),
    awayPredictedCount: integer('away_predicted_count').default(0).notNull(),

    stageType: enumMatchesStageType('stage_type').default('regular_season').notNull(),

    resultHomeScore: integer('result_home_score').default(0),
    resultAwayScore: integer('result_away_score').default(0),

    resultEndingType: enumMatchesResultEndingType('result_ending_type').default('regular'),

    roundLabel: varchar('round_label', { length: 100 }),
    roundOrder: integer('round_order'),
    groupName: varchar('group_name', { length: 50 }),

    seriesGameNumber: integer('series_game_number'),
    seriesState: varchar('series_state', { length: 100 }),

    rankedAt: timestamp('ranked_at', { precision: 3, withTimezone: true, mode: 'string' }),

    apiHockeyId: varchar('api_hockey_id', { length: 50 }),
    apiHockeyStatus: varchar('api_hockey_status', { length: 10 }),

    predictionStats: jsonb('prediction_stats')
      .$type<{
        scores: Record<string, number>;
      }>()
      .default({ scores: {} }),

    isChecked: boolean('is_checked').default(false),
    checkedAt: timestamp('checked_at', { precision: 3, withTimezone: true, mode: 'string' }),
    checkedBy: varchar('checked_by', { length: 24 }),

    ...withUpdatesFields,
  },
  (table) => [
    index('matches_competition_idx').on(table.competitionId),
    index('matches_date_idx').on(table.date),
    index('matches_home_team_idx').on(table.homeTeamId),
    index('matches_away_team_idx').on(table.awayTeamId),
    index('matches_checked_by_idx').on(table.checkedBy),

    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'matches_competition_id_fkey',
    }).onDelete('cascade'),

    foreignKey({
      columns: [table.homeTeamId],
      foreignColumns: [teams.id],
      name: 'matches_home_team_id_fkey',
    }).onDelete('restrict'),

    foreignKey({
      columns: [table.awayTeamId],
      foreignColumns: [teams.id],
      name: 'matches_away_team_id_fkey',
    }).onDelete('restrict'),

    foreignKey({
      columns: [table.checkedBy],
      foreignColumns: [users.id],
      name: 'matches_checked_by_fkey',
    }).onDelete('set null'),
  ],
);
