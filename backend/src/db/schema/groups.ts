import {
  pgTable,
  index,
  foreignKey,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  pgEnum,
  boolean,
  jsonb,
  uuid,
  type AnyPgColumn,
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

export const enumGroupStatus = pgEnum('enum_group_status', ['active', 'warning', 'locked']);

export const groups = pgTable(
  'groups',
  {
    id: generateCuid(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    type: enumGroupType('type').default('private').notNull(),

    status: enumGroupStatus('status').default('active').notNull(),
    warningExpiresAt: timestamp('warning_expires_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }),

    code: varchar('code', { length: 20 }),

    ownerId: varchar('owner_id', { length: 24 }).notNull(),
    competitionId: varchar('competition_id', { length: 24 }).notNull(),

    creditCost: integer('credit_cost').default(0).notNull(),

    maxMembers: integer('max_members').default(5).notNull(),
    absoluteMaxCapacity: integer('absolute_max_capacity').default(30).notNull(),

    statsMembersCount: integer('stats_members_count').default(0).notNull(),
    statsPendingMembersCount: integer('stats_pending_members_count').default(0).notNull(),

    isAliasRequired: boolean('is_alias_required').default(false).notNull(),

    originGroupId: varchar('origin_group_id', { length: 24 }).references(
      (): AnyPgColumn => groups.id,
    ),

    settings: jsonb('settings')
      .$type<{
        isLocked: boolean;
        allowMemberInvites: boolean;
        requireApproval: boolean;
      }>()
      .notNull()
      .default({
        isLocked: false,
        allowMemberInvites: true,
        requireApproval: true,
      }),

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

export const enumGroupMemberStatus = pgEnum('enum_group_member_status', [
  'pending',
  'invited',
  'active',
  'rejected',
  'banned',
]);

export const enumGroupMemberRole = pgEnum('enum_group_member_role', ['owner', 'admin', 'member']);

export const groupMembers = pgTable(
  'group_members',
  {
    id: generateCuid(),

    groupId: varchar('group_id', { length: 24 }).notNull(),
    userId: varchar('user_id', { length: 24 }).notNull(),
    role: enumGroupMemberRole('role').default('member'),

    alias: varchar('alias', { length: 100 }),

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
