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

export const enumGroupType = pgEnum('enum_group_type', [
  'private',
  'vip',
  'business',
  'pub',
  'partner',
]);

export const enumGroupMemberStatus = pgEnum('enum_group_member_status', [
  'pending',
  'active',
  'rejected',
  'banned',
]);

export const groups = pgTable(
  'groups',
  {
    id: generateCuid(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    type: enumGroupType('type').default('private').notNull(),

    code: varchar('code', { length: 20 }),

    ownerId: varchar('owner_id', { length: 24 }).notNull(),
    competitionId: varchar('competition_id', { length: 24 }).notNull(),

    creditCost: integer('credit_cost').default(0).notNull(),

    maxMembers: integer('max_members').default(5).notNull(),

    statsMembersCount: integer('stats_members_count').default(0).notNull(),

    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('groups_code_idx').on(table.code),
    uniqueIndex('groups_slug_idx').on(table.slug),
    index('groups_competition_idx').on(table.competitionId),
    index('groups_owner_idx').on(table.ownerId),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'groups_competition_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.ownerId],
      foreignColumns: [users.id],
      name: 'groups_owner_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const groupMembers = pgTable(
  'group_members',
  {
    id: generateCuid(),

    groupId: varchar('group_id', { length: 24 }).notNull(),
    userId: varchar('user_id', { length: 24 }).notNull(),

    status: enumGroupMemberStatus('status').default('active').notNull(),

    joinedAt: timestamp('joined_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('group_user_unique_idx').on(table.groupId, table.userId),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
      name: 'group_members_group_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'group_members_user_id_fkey',
    }).onDelete('cascade'),
  ],
);
