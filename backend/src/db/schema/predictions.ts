import {
  pgTable,
  foreignKey,
  varchar,
  integer,
  uniqueIndex,
  boolean,
  pgEnum,
  index,
  timestamp,
} from 'drizzle-orm/pg-core';
import { matches } from './matches.js';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const enumPredictionsStatus = pgEnum('enum_predictions_status', [
  'pending',
  'evaluated',
  'void',
]);

export const predictions = pgTable(
  'predictions',
  {
    id: generateCuid(),

    userId: varchar('user_id', { length: 24 }).notNull(),
    matchId: varchar('match_id', { length: 24 }).notNull(),
    competitionId: varchar('competition_id', { length: 24 }).notNull(),

    homeGoals: integer('home_goals').notNull(),
    awayGoals: integer('away_goals').notNull(),

    points: integer('points').default(0).notNull(),
    status: enumPredictionsStatus('status').default('pending').notNull(),
    evaluatedAt: timestamp('evaluated_at', { precision: 3, withTimezone: true, mode: 'string' }),

    isExact: boolean('is_exact').default(false).notNull(),
    isTrend: boolean('is_trend').default(false).notNull(),
    isDiff: boolean('is_diff').default(false).notNull(),
    isWrong: boolean('is_wrong').default(false).notNull(),

    editCount: integer('edit_count').default(0).notNull(),
    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('user_match_idx').on(table.userId, table.matchId),
    index('predictions_match_idx').on(table.matchId),
    index('predictions_user_idx').on(table.userId),
    index('predictions_competition_idx').on(table.competitionId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'predictions_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.matchId],
      foreignColumns: [matches.id],
      name: 'predictions_match_id_fkey',
    }).onDelete('cascade'),
  ],
);
