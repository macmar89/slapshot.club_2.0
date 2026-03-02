import {
  pgTable,
  index,
  foreignKey,
  varchar,
  text,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/pg-core';
import { locales } from './locales.js';
import { assets } from './assets.js';
import { generateCuid } from '../helpers.js';
import { withUpdatesFields } from '../helpers.js';

export const generalSettings = pgTable(
  'general_settings',
  {
    id: generateCuid(),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    seoImageId: varchar('seo_image_id', { length: 24 }),

    cronSettingsUpdateMatchesEnabled: boolean('cron_settings_update_matches_enabled').default(true),

    ...withUpdatesFields,
  },
  (table) => [
    index('general_settings_seo_image_idx').on(table.seoImageId),
    foreignKey({
      columns: [table.seoImageId],
      foreignColumns: [assets.id],
      name: 'general_settings_seo_image_id_fkey',
    }).onDelete('set null'),
  ],
);

export const generalSettingsLocales = pgTable(
  'general_settings_locales',
  {
    id: generateCuid(),
    parentId: varchar('parent_id', { length: 24 }).notNull(),
    locale: locales('locale').notNull(),

    gdprContent: text('gdpr_content').notNull(),

    seoTitle: varchar('seo_title', { length: 255 }),
  },
  (table) => [
    uniqueIndex('general_settings_locales_locale_parent_id_unique').on(
      table.locale,
      table.parentId,
    ),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [generalSettings.id],
      name: 'general_settings_locales_parent_id_fkey',
    }).onDelete('cascade'),
  ],
);
