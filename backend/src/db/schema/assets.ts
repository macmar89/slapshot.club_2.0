import {
  pgTable,
  varchar,
  integer,
  text,
  index,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const assets = pgTable(
  'assets',
  {
    id: generateCuid(),

    key: text('key').notNull(),

    alt: text('alt').default('').notNull(),

    url: text('url').notNull(),

    filename: varchar('filename', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }),

    filesize: integer('filesize'),
    width: integer('width'),
    height: integer('height'),

    ...withUpdatesFields,
  },
  (table) => [
    uniqueIndex('assets_key_idx').on(table.key),
    index('assets_created_at_idx').on(table.createdAt),
  ],
);
