import { pgTable, index, foreignKey, varchar, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { locales } from "./locales.js";
import { generateCuid, withUpdatesFields } from "../helpers.js";
import { assets } from "./assets.js";

export const enumTeamsType = pgEnum("enum_teams_type", ['club', 'national'])

export const teams = pgTable("teams", {
	id: generateCuid(),
	slug: varchar("slug", { length: 100 }).notNull(),
	type: enumTeamsType("type").default('club').notNull(),

	logoId: varchar("logo_id", { length: 24 }),

	colorsPrimary: varchar("colors_primary", { length: 7 }).default('#000000').notNull(),
	colorsSecondary: varchar("colors_secondary", { length: 7 }).default('#ffffff').notNull(),

	apiHockeyId: varchar("api_hockey_id"),

	...withUpdatesFields,
}, (table) => [
	uniqueIndex("teams_slug_idx").on(table.slug),
    index("teams_logo_idx").on(table.logoId),
    foreignKey({
        columns: [table.logoId],
        foreignColumns: [assets.id],
        name: "teams_logo_id_fkey"
    }).onDelete("set null"),
]);

export const teamsLocales = pgTable("teams_locales", {
	id: generateCuid(),
	parentId: varchar("parent_id", { length: 24 }).notNull(),
	locale: locales("locale").notNull(),

	name: varchar("name", { length: 100 }).notNull(),
	shortName: varchar("short_name", { length: 10 }).notNull(),
}, (table) => [
	uniqueIndex("teams_locales_locale_parent_id_unique").on(table.locale, table.parentId),
    foreignKey({
        columns: [table.parentId],
        foreignColumns: [teams.id],
        name: "teams_locales_parent_id_fkey"
    }).onDelete("cascade"),
]);