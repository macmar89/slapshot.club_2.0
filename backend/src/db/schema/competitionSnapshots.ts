import { pgTable, index, foreignKey, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { competitions } from './competitions.js';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const competitionSnapshots = pgTable(
  'competition_snapshots',
  {
    id: generateCuid(),
    competitionId: varchar('competition_id', { length: 24 }).notNull(),
    userId: varchar('user_id', { length: 24 }).notNull(),
    rank: integer().notNull(),
    ovr: integer().notNull(),
    points: integer().notNull().default(0),
    exactGuesses: integer('exact_guesses').default(0),
    winnerDiff: integer('winner_diff').default(0),
    winner: integer().default(0),
    adjacent: integer().default(0),
    totalTips: integer('total_tips').default(0),
    date: timestamp({ precision: 3, withTimezone: true, mode: 'string' }).notNull(),
    ...withUpdatesFields,
  },
  (table) => [
    index('user_comp_date_idx').on(table.userId, table.competitionId, table.date),
    index('competition_date_idx').on(table.competitionId, table.date),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'competition_snapshots_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'competition_snapshots_competition_id_fkey',
    }).onDelete('cascade'),
  ],
);
