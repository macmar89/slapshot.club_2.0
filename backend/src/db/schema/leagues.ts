import {
  pgTable,
  index,
  foreignKey,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { competitions } from './competitions.js';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const enumLeaguesType = pgEnum('enum_leagues_type', [
  'private',
  'vip',
  'business',
  'pub',
  'partner',
]);

export const enumLeagueMemberStatus = pgEnum('enum_league_member_status', [
  'pending',
  'active',
  'rejected',
  'banned',
]);

export const leagues = pgTable(
  'leagues',
  {
    id: generateCuid(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    type: enumLeaguesType('type').default('private').notNull(),

    code: varchar('code', { length: 20 }),

    ownerId: varchar('owner_id', { length: 24 }).notNull(),
    competitionId: varchar('competition_id', { length: 24 }).notNull(),

    creditCost: integer('credit_cost').default(0).notNull(),

    maxMembers: integer('max_members').default(5).notNull(),

    statsMembersCount: integer('stats_members_count').default(0).notNull(),

    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('leagues_code_idx').on(table.code),
    uniqueIndex('leagues_slug_idx').on(table.slug),
    index('leagues_competition_idx').on(table.competitionId),
    index('leagues_owner_idx').on(table.ownerId),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'leagues_competition_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.ownerId],
      foreignColumns: [users.id],
      name: 'leagues_owner_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const leagueMembers = pgTable(
  'league_members',
  {
    id: generateCuid(),

    leagueId: varchar('league_id', { length: 24 }).notNull(),
    userId: varchar('user_id', { length: 24 }).notNull(),

    status: enumLeagueMemberStatus('status').default('active').notNull(),

    joinedAt: timestamp('joined_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('league_user_unique_idx').on(table.leagueId, table.userId),
    foreignKey({
      columns: [table.leagueId],
      foreignColumns: [leagues.id],
      name: 'league_members_league_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'league_members_user_id_fkey',
    }).onDelete('cascade'),
  ],
);
