import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  foreignKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { generateCuid, withUpdatesFields } from '../helpers.js';
import { locales } from './locales.js';

export const announcementTypeEnum = pgEnum('announcement_type', [
  'FEATURE',
  'LEAGUE',
  'IMPORTANT',
  'MAINTENANCE',
  'EVENT',
  'BUGFIX',
  'GENERAL',
]);

export const announcements = pgTable(
  'announcements',
  {
    id: generateCuid(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    type: announcementTypeEnum('type').default('GENERAL').notNull(),

    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),

    ...withUpdatesFields,
  },
  (table) => [
    index('announcements_created_at_idx').on(table.createdAt),
    index('announcements_is_published_idx').on(table.isPublished),
  ],
);

export const announcementsLocales = pgTable(
  'announcements_locales',
  {
    id: generateCuid(),
    parentId: varchar('parent_id', { length: 24 }).notNull(),
    locale: locales('locale').notNull(),

    title: varchar('title', { length: 100 }).notNull(),
    excerpt: varchar('excerpt', { length: 500 }).notNull(),
    content: text('content').notNull(),
  },
  (table) => [
    uniqueIndex('announcements_locales_locale_parent_id_unique').on(table.locale, table.parentId),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [announcements.id],
      name: 'announcements_locales_parent_id_fkey',
    }).onDelete('cascade'),
  ],
);
