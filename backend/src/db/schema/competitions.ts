import { pgTable, index, foreignKey, varchar,  timestamp, integer, uniqueIndex, boolean, pgEnum, text } from "drizzle-orm/pg-core";
import { locales } from "./locales.js";
import { generateCuid, withUpdatesFields } from "../helpers.js";

export const enumCompetitionsStatus = pgEnum("enum_competitions_status", ['upcoming', 'active', 'finished'])

export const competitions = pgTable("competitions", {
	id: generateCuid(),
	slug: varchar('slug',{ length: 100 }).notNull(),

	sortOrder: integer("sort_order").default(100).notNull(),

	seasonYear: integer("season_year").notNull(),
	creditCost: integer("credit_cost").default(0).notNull(),

	status: enumCompetitionsStatus("status").default('upcoming').notNull(),

	isRegistrationOpen: boolean("is_registration_open").default(false),
	startDate: timestamp("start_date", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),

	totalPlayedMatches: integer("total_played_matches").default(0),
	totalPossiblePoints: integer("total_possible_points").default(0),

	recalculationHour: integer("recalculation_hour").default(5),

	apiHockeyId: varchar("api_hockey_id"),
	apiHockeySeason: integer("api_hockey_season"),

	...withUpdatesFields,
}, (table) => [
	index("competitions_sort_order_idx").on(table.sortOrder),
	uniqueIndex("competitions_slug_idx").on(table.slug),
]);

export const competitionsLocales = pgTable("competitions_locales", {
	id: generateCuid(),
	competitionId: varchar("competition_id", { length: 24 }).notNull(),
	name: varchar("name", {length: 255}).notNull(),
	description: text('description').notNull(),
	locale: locales("locale").notNull(),
}, (table) => [
	uniqueIndex("competitions_locales_locale_comp_id_unique").on(table.locale, table.competitionId),
	foreignKey({
			columns: [table.competitionId],
			foreignColumns: [competitions.id],
			name: "competitions_locales__parent_id_fkey"
		}).onDelete("cascade"),
]);
