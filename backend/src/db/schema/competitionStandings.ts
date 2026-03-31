import {
  pgTable,
  integer,
  varchar,
  jsonb,
  index,
  foreignKey,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { competitions, teams } from './index.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const competitionStandings = pgTable(
  'competition_standings',
  {
    id: generateCuid(),

    competitionId: varchar('competition_id', { length: 24 }).notNull(),
    teamId: varchar('team_id', { length: 24 }).notNull(),
    groupName: varchar('group_name', { length: 50 }),

    rank: integer('rank').notNull(),
    points: integer('points').default(0).notNull(),
    played: integer('played').default(0).notNull(),

    win: integer('win').default(0).notNull(),
    winOvertime: integer('win_overtime').default(0).notNull(),
    lose: integer('lose').default(0).notNull(),
    loseOvertime: integer('lose_overtime').default(0).notNull(),

    goalsFor: integer('goals_for').default(0).notNull(),
    goalsAgainst: integer('goals_against').default(0).notNull(),

    form: varchar('form', { length: 5 }).default('').notNull(),

    phase: varchar('phase', { length: 100 }).default('regular').notNull(),

    seriesScore: varchar('series_score', { length: 10 }),

    ...withUpdatesFields,
  },
  (table) => [
    index('competition_standings_competition_id_idx').on(table.competitionId),
    index('competition_standings_team_id_idx').on(table.teamId),
    uniqueIndex('competition_standings_competition_team_idx').on(table.competitionId, table.teamId),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'competition_standings_competition_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: 'competition_standings_team_id_fkey',
    }).onDelete('cascade'),
  ],
);
