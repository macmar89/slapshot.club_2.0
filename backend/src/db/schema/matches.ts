import { pgTable, index, foreignKey, varchar, numeric, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { competitions } from "./competitions.js";
import { teams } from "./teams.js";
import { generateCuid, withUpdatesFields } from "../helpers.js";

export const enumMatchesResultEndingType = pgEnum("enum_matches_result_ending_type", ['regular', 'ot', 'so'])

export const enumMatchesResultStageType = pgEnum("enum_matches_result_stage_type", ['regular_season', 'group_phase', 'playoffs', 'pre_season'])

export const enumMatchesStatus = pgEnum("enum_matches_status", ['scheduled', 'live', 'finished', 'cancelled'])

export const matches = pgTable("matches", {
	id: generateCuid(),

	displayTitle: varchar("display_title", { length: 255 }),

	competitionId: varchar("competition_id", { length: 24 }).notNull(),
	homeTeamId: varchar("home_team_id", { length: 24 }).notNull(),
	awayTeamId: varchar("away_team_id", { length: 24 }).notNull(),

	date: timestamp('date', { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	status: enumMatchesStatus('status').default('scheduled').notNull(),

	homePredictedCount: integer("home_predicted_count").default(0).notNull(),
	awayPredictedCount: integer("away_predicted_count").default(0).notNull(),

	resultStageType: enumMatchesResultStageType("result_stage_type").default('regular_season').notNull(),

	resultHomeScore: integer("result_home_score").default(0),
	resultAwayScore: integer("result_away_score").default(0),

	resultEndingType: enumMatchesResultEndingType("result_ending_type").default('regular'),

	resultRoundLabel: varchar("result_round_label", { length: 100 }),
	resultRoundOrder: integer("result_round_order"),
	resultGroupName: varchar("result_group_name", { length: 50 }),

	resultSeriesGameNumber: integer("result_series_game_number"),
	resultSeriesState: varchar("result_series_state", { length: 100 }),

	rankedAt: timestamp("ranked_at", { precision: 3, withTimezone: true, mode: 'string' }),

	apiHockeyId: varchar("api_hockey_id", { length: 50 }),
	apiHockeyStatus: varchar("api_hockey_status", { length: 10 }),

	...withUpdatesFields,
}, (table) => [
	index("matches_competition_idx").on(table.competitionId),
    index("matches_date_idx").on(table.date),
    index("matches_home_team_idx").on(table.homeTeamId),
    index("matches_away_team_idx").on(table.awayTeamId),
    
    foreignKey({
        columns: [table.competitionId],
        foreignColumns: [competitions.id],
        name: "matches_competition_id_fkey"
    }).onDelete("cascade"),

    foreignKey({
        columns: [table.homeTeamId],
        foreignColumns: [teams.id],
        name: "matches_home_team_id_fkey"
    }).onDelete("restrict"),

    foreignKey({
        columns: [table.awayTeamId],
        foreignColumns: [teams.id],
        name: "matches_away_team_id_fkey"
    }).onDelete("restrict"),
]);
