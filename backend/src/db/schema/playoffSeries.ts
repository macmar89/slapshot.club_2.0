import { pgTable, integer, boolean, varchar, index, foreignKey } from 'drizzle-orm/pg-core';
import { generateCuid, withUpdatesFields } from '../helpers.js';
import { competitions } from './competitions.js';
import { teams } from './teams.js';

export const playoffSeries = pgTable(
  'playoff_series',
  {
    id: generateCuid(),
    competitionId: varchar('competition_id', { length: 24 }).notNull(),
    team1Id: varchar('team1_id', { length: 24 }).notNull(),
    team2Id: varchar('team2_id', { length: 24 }).notNull(),
    score1: integer('score1').default(0),
    score2: integer('score2').default(0),
    stage: varchar('stage', { length: 50 }),
    isFinished: boolean('is_finished').default(false),

    ...withUpdatesFields,
  },
  (table) => [
    index('playoff_series_competition_idx').on(table.competitionId),
    index('playoff_series_team1_idx').on(table.team1Id),
    index('playoff_series_team2_idx').on(table.team2Id),

    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'playoff_series_competition_id_fkey',
    }).onDelete('cascade'),

    foreignKey({
      columns: [table.team1Id],
      foreignColumns: [teams.id],
      name: 'playoff_series_team1_id_fkey',
    }).onDelete('restrict'),

    foreignKey({
      columns: [table.team2Id],
      foreignColumns: [teams.id],
      name: 'playoff_series_team2_id_fkey',
    }).onDelete('restrict'),
  ],
);
