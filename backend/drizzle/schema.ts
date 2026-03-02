import { pgTable, index, foreignKey, varchar, numeric, timestamp, integer, jsonb, uniqueIndex, boolean, pgSequence, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const locales = pgEnum("_locales", ['sk', 'en', 'cz'])
export const enumAnnouncementsIcon = pgEnum("enum_announcements_icon", ['bell', 'trophy', 'star', 'gift', 'alert'])
export const enumAnnouncementsTargetingTargetRoles = pgEnum("enum_announcements_targeting_target_roles", ['admin', 'editor', 'user'])
export const enumBadgesIconType = pgEnum("enum_badges_icon_type", ['lucide', 'upload'])
export const enumBadgesRarity = pgEnum("enum_badges_rarity", ['bronze', 'silver', 'gold', 'platinum'])
export const enumFeedbackStatus = pgEnum("enum_feedback_status", ['new', 'in-progress', 'resolved', 'ignored'])
export const enumFeedbackType = pgEnum("enum_feedback_type", ['bug', 'idea', 'change_user_email_request', 'custom_country_request', 'other'])
export const enumLeaguesType = pgEnum("enum_leagues_type", ['private', 'public'])
export const enumMatchesResultEndingType = pgEnum("enum_matches_result_ending_type", ['regular', 'ot', 'so'])
export const enumMatchesResultStageType = pgEnum("enum_matches_result_stage_type", ['regular_season', 'group_phase', 'playoffs', 'pre_season'])
export const enumMatchesStatus = pgEnum("enum_matches_status", ['scheduled', 'live', 'finished', 'cancelled'])
export const enumPayloadJobsLogState = pgEnum("enum_payload_jobs_log_state", ['failed', 'succeeded'])
export const enumPayloadJobsLogTaskSlug = pgEnum("enum_payload_jobs_log_task_slug", ['inline', 'update-matches', 'update-realtime-ranking', 'sync-hockey-matches', 'sync-future-matches', 'sync-teams', 'update-leaderboards', 'evaluate-match', 'send-push-notification'])
export const enumPayloadJobsTaskSlug = pgEnum("enum_payload_jobs_task_slug", ['inline', 'update-matches', 'update-realtime-ranking', 'sync-hockey-matches', 'sync-future-matches', 'sync-teams', 'update-leaderboards', 'evaluate-match', 'send-push-notification'])
export const enumPredictionsStatus = pgEnum("enum_predictions_status", ['pending', 'evaluated', 'void'])
export const enumTeamsCountry = pgEnum("enum_teams_country", ['SVK', 'CZE', 'USA', 'CAN'])
export const enumTeamsLeagueTags = pgEnum("enum_teams_league_tags", ['sk', 'nhl', 'cz', 'khl', 'sk1', 'iihf'])
export const enumTeamsType = pgEnum("enum_teams_type", ['club', 'national'])
export const enumUserMembershipsStatus = pgEnum("enum_user_memberships_status", ['active', 'pending', 'cancelled', 'expired'])
export const enumUsersJerseyPattern = pgEnum("enum_users_jersey_pattern", ['stripes', 'bands', 'plain', 'chevrons', 'hoops'])
export const enumUsersJerseyStyle = pgEnum("enum_users_jersey_style", ['classic', 'modern'])
export const enumUsersPreferredLanguage = pgEnum("enum_users_preferred_language", ['sk', 'en', 'cz'])
export const enumUsersRole = pgEnum("enum_users_role", ['admin', 'editor', 'user'])
export const enumUsersStatsTrend = pgEnum("enum_users_stats_trend", ['up', 'down', 'stable'])
export const enumUsersSubscriptionPlan = pgEnum("enum_users_subscription_plan", ['free', 'pro', 'vip'])
export const enumUsersSubscriptionPlanType = pgEnum("enum_users_subscription_plan_type", ['seasonal', 'lifetime'])

export const payloadJobsStatsIdSeq = pgSequence("payload_jobs_stats_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const payloadJobsIdSeq = pgSequence("payload_jobs_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const announcementsLocalesIdSeq = pgSequence("announcements_locales_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const announcementsTargetingTargetRolesIdSeq = pgSequence("announcements_targeting_target_roles_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const badgesLocalesIdSeq = pgSequence("badges_locales_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const competitionsLocalesIdSeq = pgSequence("competitions_locales_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const competitionsRelsIdSeq = pgSequence("competitions_rels_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const countriesIdSeq = pgSequence("countries_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const countriesLocalesIdSeq = pgSequence("countries_locales_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const announcementsIdSeq = pgSequence("announcements_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const generalSettingsIdSeq = pgSequence("general_settings_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const leaguesRelsIdSeq = pgSequence("leagues_rels_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const miniLeaguesIdSeq = pgSequence("mini_leagues_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const miniLeaguesRelsIdSeq = pgSequence("mini_leagues_rels_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const payloadLockedDocumentsIdSeq = pgSequence("payload_locked_documents_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const payloadKvIdSeq = pgSequence("payload_kv_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const payloadMigrationsIdSeq = pgSequence("payload_migrations_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const payloadLockedDocumentsRelsIdSeq = pgSequence("payload_locked_documents_rels_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const regionsLocalesIdSeq = pgSequence("regions_locales_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const rateLimitsIdSeq = pgSequence("rate_limits_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const regionsIdSeq = pgSequence("regions_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const teamsLocalesIdSeq = pgSequence("teams_locales_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const payloadPreferencesIdSeq = pgSequence("payload_preferences_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const usersRelsIdSeq = pgSequence("users_rels_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const usersLocalesIdSeq = pgSequence("users_locales_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const generalSettingsLocalesIdSeq = pgSequence("general_settings_locales_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const payloadPreferencesRelsIdSeq = pgSequence("payload_preferences_rels_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const teamsLeagueTagsIdSeq = pgSequence("teams_league_tags_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

export const announcementsLocales = pgTable("announcements_locales", {
	title: varchar().notNull(),
	content: varchar().notNull(),
	buttonText: varchar("button_text").default('OK'),
	id: integer().default(sql`nextval('announcements_locales_id_seq'::regclass)`).primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
}, (table) => [
	uniqueIndex("announcements_locales_locale_parent_id_unique").using("btree", table.locale.asc().nullsLast().op("int4_ops"), table.parentId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [announcements.id],
			name: "announcements_locales__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const announcementsTargetingTargetRoles = pgTable("announcements_targeting_target_roles", {
	order: integer().notNull(),
	parentId: integer("parent_id").notNull(),
	value: enumAnnouncementsTargetingTargetRoles(),
	id: integer().default(sql`nextval('announcements_targeting_target_roles_id_seq'::regclass)`).primaryKey().notNull(),
}, (table) => [
	index("announcements_targeting_target_roles_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("announcements_targeting_target_roles_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [announcements.id],
			name: "announcements_targeting_target_roles_parent_id_fkey"
		}).onDelete("cascade"),
]);

export const competitionsLocales = pgTable("competitions_locales", {
	name: varchar().notNull(),
	description: varchar().notNull(),
	id: integer().default(sql`nextval('competitions_locales_id_seq'::regclass)`).primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
}, (table) => [
	uniqueIndex("competitions_locales_locale_parent_id_unique").using("btree", table.locale.asc().nullsLast().op("text_ops"), table.parentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [competitions.id],
			name: "competitions_locales__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const badgesLocales = pgTable("badges_locales", {
	name: varchar().notNull(),
	description: varchar(),
	id: integer().default(sql`nextval('badges_locales_id_seq'::regclass)`).primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
}, (table) => [
	uniqueIndex("badges_locales_locale_parent_id_unique").using("btree", table.locale.asc().nullsLast().op("text_ops"), table.parentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [badges.id],
			name: "badges_locales__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const payloadJobs = pgTable("payload_jobs", {
	id: integer().default(sql`nextval('payload_jobs_id_seq'::regclass)`).primaryKey().notNull(),
	input: jsonb(),
	completedAt: timestamp("completed_at", { precision: 3, withTimezone: true, mode: 'string' }),
	totalTried: numeric("total_tried").default('0'),
	hasError: boolean("has_error").default(false),
	error: jsonb(),
	taskSlug: enumPayloadJobsTaskSlug("task_slug"),
	queue: varchar().default('default'),
	waitUntil: timestamp("wait_until", { precision: 3, withTimezone: true, mode: 'string' }),
	processing: boolean().default(false),
	meta: jsonb(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("payload_jobs_completed_at_idx").using("btree", table.completedAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_jobs_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_jobs_has_error_idx").using("btree", table.hasError.asc().nullsLast().op("bool_ops")),
	index("payload_jobs_processing_idx").using("btree", table.processing.asc().nullsLast().op("bool_ops")),
	index("payload_jobs_queue_idx").using("btree", table.queue.asc().nullsLast().op("text_ops")),
	index("payload_jobs_task_slug_idx").using("btree", table.taskSlug.asc().nullsLast().op("enum_ops")),
	index("payload_jobs_total_tried_idx").using("btree", table.totalTried.asc().nullsLast().op("numeric_ops")),
	index("payload_jobs_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_jobs_wait_until_idx").using("btree", table.waitUntil.asc().nullsLast().op("timestamptz_ops")),
]);

export const feedback = pgTable("feedback", {
	id: varchar().primaryKey().notNull(),
	type: enumFeedbackType().default('idea').notNull(),
	message: varchar().notNull(),
	pageUrl: varchar("page_url"),
	userId: varchar("user_id"),
	read: boolean().default(false),
	status: enumFeedbackStatus().default('new'),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("feedback_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("feedback_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("feedback_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "feedback_user_id_fkey"
		}).onDelete("set null"),
]);

export const countries = pgTable("countries", {
	id: integer().default(sql`nextval('countries_id_seq'::regclass)`).primaryKey().notNull(),
	code: varchar().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("countries_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("countries_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const announcements = pgTable("announcements", {
	id: integer().default(sql`nextval('announcements_id_seq'::regclass)`).primaryKey().notNull(),
	name: varchar().notNull(),
	isActive: boolean("is_active").default(true),
	imageId: varchar("image_id"),
	maxDisplaysPerUser: numeric("max_displays_per_user").default('1'),
	targetingMinPoints: numeric("targeting_min_points"),
	targetingMaxPoints: numeric("targeting_max_points"),
	icon: enumAnnouncementsIcon().default('bell'),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("announcements_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("announcements_image_idx").using("btree", table.imageId.asc().nullsLast().op("text_ops")),
	index("announcements_is_active_idx").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("announcements_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "announcements_image_id_fkey"
		}).onDelete("set null"),
]);

export const leagues = pgTable("leagues", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	type: enumLeaguesType().default('private').notNull(),
	code: varchar(),
	ownerId: varchar("owner_id").notNull(),
	competitionId: varchar("competition_id").notNull(),
	maxMembers: numeric("max_members").default('30').notNull(),
	statsAverageScore: numeric("stats_average_score").default('0'),
	statsTotalScore: numeric("stats_total_score").default('0'),
	statsMemberCount: numeric("stats_member_count").default('1'),
	statsRank: numeric("stats_rank"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("leagues_code_idx").using("btree", table.code.asc().nullsLast().op("text_ops")),
	index("leagues_competition_idx").using("btree", table.competitionId.asc().nullsLast().op("text_ops")),
	index("leagues_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("leagues_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("leagues_owner_idx").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	index("leagues_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.competitionId],
			foreignColumns: [competitions.id],
			name: "leagues_competition_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "leagues_owner_id_fkey"
		}).onDelete("set null"),
]);

export const leaguesRels = pgTable("leagues_rels", {
	id: integer().default(sql`nextval('leagues_rels_id_seq'::regclass)`).primaryKey().notNull(),
	order: integer(),
	parentId: varchar("parent_id").notNull(),
	path: varchar().notNull(),
	usersId: varchar("users_id"),
}, (table) => [
	index("leagues_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("leagues_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	index("leagues_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
	index("leagues_rels_users_id_idx").using("btree", table.usersId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [leagues.id],
			name: "leagues_rels_parent_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.usersId],
			foreignColumns: [users.id],
			name: "leagues_rels_users_id_fkey"
		}).onDelete("cascade"),
]);

export const matches = pgTable("matches", {
	id: varchar().primaryKey().notNull(),
	displayTitle: varchar("display_title"),
	competitionId: varchar("competition_id").notNull(),
	date: timestamp({ precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	homeTeamId: varchar("home_team_id").notNull(),
	awayTeamId: varchar("away_team_id").notNull(),
	status: enumMatchesStatus().default('scheduled').notNull(),
	resultStageType: enumMatchesResultStageType("result_stage_type").default('regular_season').notNull(),
	resultHomeScore: numeric("result_home_score").default('0'),
	resultAwayScore: numeric("result_away_score").default('0'),
	resultEndingType: enumMatchesResultEndingType("result_ending_type").default('regular'),
	resultRoundLabel: varchar("result_round_label"),
	resultRoundOrder: numeric("result_round_order"),
	resultGroupName: varchar("result_group_name"),
	resultSeriesGameNumber: numeric("result_series_game_number"),
	resultSeriesState: varchar("result_series_state"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	rankedAt: timestamp("ranked_at", { precision: 3, withTimezone: true, mode: 'string' }),
	apiHockeyId: varchar("api_hockey_id"),
	apiHockeyStatus: varchar("api_hockey_status"),
}, (table) => [
	index("matches_away_team_idx").using("btree", table.awayTeamId.asc().nullsLast().op("text_ops")),
	index("matches_competition_idx").using("btree", table.competitionId.asc().nullsLast().op("text_ops")),
	index("matches_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("matches_date_idx").using("btree", table.date.asc().nullsLast().op("timestamptz_ops")),
	index("matches_home_team_idx").using("btree", table.homeTeamId.asc().nullsLast().op("text_ops")),
	index("matches_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.competitionId],
			foreignColumns: [competitions.id],
			name: "matches_competition_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.homeTeamId],
			foreignColumns: [teams.id],
			name: "matches_home_team_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.awayTeamId],
			foreignColumns: [teams.id],
			name: "matches_away_team_id_fkey"
		}).onDelete("set null"),
]);

export const membershipTiersFeatures = pgTable("membership_tiers_features", {
	order: integer("_order").notNull(),
	parentId: varchar("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	description: varchar(),
}, (table) => [
	index("membership_tiers_features_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("membership_tiers_features_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [membershipTiers.id],
			name: "membership_tiers_features__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const miniLeagues = pgTable("mini_leagues", {
	id: integer().default(sql`nextval('mini_leagues_id_seq'::regclass)`).primaryKey().notNull(),
	name: varchar().notNull(),
	competitionId: varchar("competition_id").notNull(),
	ownerId: varchar("owner_id").notNull(),
	inviteCode: varchar("invite_code"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("mini_leagues_competition_idx").using("btree", table.competitionId.asc().nullsLast().op("text_ops")),
	index("mini_leagues_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("mini_leagues_invite_code_idx").using("btree", table.inviteCode.asc().nullsLast().op("text_ops")),
	index("mini_leagues_owner_idx").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	index("mini_leagues_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "mini_leagues_owner_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.competitionId],
			foreignColumns: [competitions.id],
			name: "mini_leagues_competition_id_fkey"
		}).onDelete("set null"),
]);

export const badgeMedia = pgTable("badge_media", {
	id: varchar().primaryKey().notNull(),
	alt: varchar().notNull(),
	prefix: varchar().default('badge'),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	url: varchar(),
	thumbnailURL: varchar("thumbnail_u_r_l"),
	filename: varchar(),
	mimeType: varchar("mime_type"),
	filesize: numeric(),
	width: numeric(),
	height: numeric(),
	focalX: numeric("focal_x"),
	focalY: numeric("focal_y"),
	sizesThumbnailUrl: varchar("sizes_thumbnail_url"),
	sizesThumbnailWidth: numeric("sizes_thumbnail_width"),
	sizesThumbnailHeight: numeric("sizes_thumbnail_height"),
	sizesThumbnailMimeType: varchar("sizes_thumbnail_mime_type"),
	sizesThumbnailFilesize: numeric("sizes_thumbnail_filesize"),
	sizesThumbnailFilename: varchar("sizes_thumbnail_filename"),
	sizesBadgeUrl: varchar("sizes_badge_url"),
	sizesBadgeWidth: numeric("sizes_badge_width"),
	sizesBadgeHeight: numeric("sizes_badge_height"),
	sizesBadgeMimeType: varchar("sizes_badge_mime_type"),
	sizesBadgeFilesize: numeric("sizes_badge_filesize"),
	sizesBadgeFilename: varchar("sizes_badge_filename"),
}, (table) => [
	index("badge_media_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("badge_media_filename_idx").using("btree", table.filename.asc().nullsLast().op("text_ops")),
	index("badge_media_sizes_badge_sizes_badge_filename_idx").using("btree", table.sizesBadgeFilename.asc().nullsLast().op("text_ops")),
	index("badge_media_sizes_thumbnail_sizes_thumbnail_filename_idx").using("btree", table.sizesThumbnailFilename.asc().nullsLast().op("text_ops")),
	index("badge_media_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const generalSettings = pgTable("general_settings", {
	id: integer().default(sql`nextval('general_settings_id_seq'::regclass)`).primaryKey().notNull(),
	seoTitle: varchar("seo_title"),
	seoDescription: varchar("seo_description"),
	seoImageId: varchar("seo_image_id"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }),
	cronSettingsUpdateMatchesEnabled: boolean("cron_settings_update_matches_enabled").default(true),
}, (table) => [
	index("general_settings_seo_seo_image_idx").using("btree", table.seoImageId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.seoImageId],
			foreignColumns: [media.id],
			name: "general_settings_seo_image_id_fkey"
		}).onDelete("set null"),
]);

export const leaderboardEntries = pgTable("leaderboard_entries", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	competitionId: varchar("competition_id").notNull(),
	totalPoints: numeric("total_points").default('0'),
	totalMatches: numeric("total_matches").default('0'),
	exactGuesses: numeric("exact_guesses").default('0'),
	correctTrends: numeric("correct_trends").default('0'),
	correctDiffs: numeric("correct_diffs").default('0'),
	wrongGuesses: numeric("wrong_guesses").default('0'),
	currentRank: numeric("current_rank"),
	previousRank: numeric("previous_rank"),
	rankChange: numeric("rank_change"),
	activeLeagueId: varchar("active_league_id"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ovr: numeric(),
}, (table) => [
	index("competition_totalPoints_idx").using("btree", table.competitionId.asc().nullsLast().op("numeric_ops"), table.totalPoints.asc().nullsLast().op("numeric_ops")),
	index("leaderboard_entries_active_league_idx").using("btree", table.activeLeagueId.asc().nullsLast().op("text_ops")),
	index("leaderboard_entries_competition_idx").using("btree", table.competitionId.asc().nullsLast().op("text_ops")),
	index("leaderboard_entries_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("leaderboard_entries_current_rank_idx").using("btree", table.currentRank.asc().nullsLast().op("numeric_ops")),
	index("leaderboard_entries_total_matches_idx").using("btree", table.totalMatches.asc().nullsLast().op("numeric_ops")),
	index("leaderboard_entries_total_points_idx").using("btree", table.totalPoints.asc().nullsLast().op("numeric_ops")),
	index("leaderboard_entries_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("leaderboard_entries_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	uniqueIndex("user_competition_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.competitionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.activeLeagueId],
			foreignColumns: [leagues.id],
			name: "leaderboard_entries_active_league_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.competitionId],
			foreignColumns: [competitions.id],
			name: "leaderboard_entries_competition_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "leaderboard_entries_user_id_fkey"
		}).onDelete("set null"),
]);

export const miniLeaguesRels = pgTable("mini_leagues_rels", {
	id: integer().default(sql`nextval('mini_leagues_rels_id_seq'::regclass)`).primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	usersId: varchar("users_id"),
}, (table) => [
	index("mini_leagues_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("mini_leagues_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	index("mini_leagues_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
	index("mini_leagues_rels_users_id_idx").using("btree", table.usersId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [miniLeagues.id],
			name: "mini_leagues_rels_parent_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.usersId],
			foreignColumns: [users.id],
			name: "mini_leagues_rels_users_id_fkey"
		}).onDelete("cascade"),
]);

export const payloadLockedDocuments = pgTable("payload_locked_documents", {
	id: integer().default(sql`nextval('payload_locked_documents_id_seq'::regclass)`).primaryKey().notNull(),
	globalSlug: varchar("global_slug"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("payload_locked_documents_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_locked_documents_global_slug_idx").using("btree", table.globalSlug.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const payloadKv = pgTable("payload_kv", {
	id: integer().default(sql`nextval('payload_kv_id_seq'::regclass)`).primaryKey().notNull(),
	key: varchar().notNull(),
	data: jsonb().notNull(),
}, (table) => [
	uniqueIndex("payload_kv_key_idx").using("btree", table.key.asc().nullsLast().op("text_ops")),
]);

export const media = pgTable("media", {
	id: varchar().primaryKey().notNull(),
	alt: varchar().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	url: varchar(),
	thumbnailURL: varchar("thumbnail_u_r_l"),
	filename: varchar(),
	mimeType: varchar("mime_type"),
	filesize: numeric(),
	width: numeric(),
	height: numeric(),
	focalX: numeric("focal_x"),
	focalY: numeric("focal_y"),
}, (table) => [
	index("media_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("media_filename_idx").using("btree", table.filename.asc().nullsLast().op("text_ops")),
	index("media_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const payloadMigrations = pgTable("payload_migrations", {
	id: integer().default(sql`nextval('payload_migrations_id_seq'::regclass)`).primaryKey().notNull(),
	name: varchar(),
	batch: numeric(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("payload_migrations_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_migrations_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const regionsLocales = pgTable("regions_locales", {
	name: varchar().notNull(),
	id: integer().default(sql`nextval('regions_locales_id_seq'::regclass)`).primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
}, (table) => [
	uniqueIndex("regions_locales_locale_parent_id_unique").using("btree", table.locale.asc().nullsLast().op("int4_ops"), table.parentId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [regions.id],
			name: "regions_locales__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const teams = pgTable("teams", {
	id: varchar().primaryKey().notNull(),
	slug: varchar(),
	type: enumTeamsType().default('club').notNull(),
	country: enumTeamsCountry(),
	logoId: varchar("logo_id"),
	colorsPrimary: varchar("colors_primary").default('#000000').notNull(),
	colorsSecondary: varchar("colors_secondary").default('#ffffff').notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	apiHockeyId: varchar("api_hockey_id"),
}, (table) => [
	index("teams_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("teams_logo_idx").using("btree", table.logoId.asc().nullsLast().op("text_ops")),
	index("teams_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.logoId],
			foreignColumns: [teamLogos.id],
			name: "teams_logo_id_fkey"
		}).onDelete("set null"),
]);

export const payloadLockedDocumentsRels = pgTable("payload_locked_documents_rels", {
	id: integer().default(sql`nextval('payload_locked_documents_rels_id_seq'::regclass)`).primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	usersId: varchar("users_id"),
	mediaId: varchar("media_id"),
	competitionsId: varchar("competitions_id"),
	feedbackId: varchar("feedback_id"),
	membershipTiersId: varchar("membership_tiers_id"),
	userMembershipsId: varchar("user_memberships_id"),
	leaderboardEntriesId: varchar("leaderboard_entries_id"),
	teamsId: varchar("teams_id"),
	matchesId: varchar("matches_id"),
	predictionsId: varchar("predictions_id"),
	leaguesId: varchar("leagues_id"),
	miniLeaguesId: integer("mini_leagues_id"),
	teamLogosId: varchar("team_logos_id"),
	rateLimitsId: integer("rate_limits_id"),
	announcementsId: integer("announcements_id"),
	countriesId: integer("countries_id"),
	regionsId: integer("regions_id"),
	badgesId: varchar("badges_id"),
	badgeMediaId: varchar("badge_media_id"),
	competitionSnapshotsId: varchar("competition_snapshots_id"),
	notificationSettingsId: varchar("notification_settings_id"),
}, (table) => [
	index("payload_locked_documents_rels_announcements_id_idx").using("btree", table.announcementsId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_badge_media_id_idx").using("btree", table.badgeMediaId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_badges_id_idx").using("btree", table.badgesId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_competition_snapshots_id_idx").using("btree", table.competitionSnapshotsId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_competitions_id_idx").using("btree", table.competitionsId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_countries_id_idx").using("btree", table.countriesId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_feedback_id_idx").using("btree", table.feedbackId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_leaderboard_entries_id_idx").using("btree", table.leaderboardEntriesId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_leagues_id_idx").using("btree", table.leaguesId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_matches_id_idx").using("btree", table.matchesId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_media_id_idx").using("btree", table.mediaId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_membership_tiers_id_idx").using("btree", table.membershipTiersId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_mini_leagues_id_idx").using("btree", table.miniLeaguesId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_notification_settings_id_idx").using("btree", table.notificationSettingsId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_predictions_id_idx").using("btree", table.predictionsId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_rate_limits_id_idx").using("btree", table.rateLimitsId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_regions_id_idx").using("btree", table.regionsId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_team_logos_id_idx").using("btree", table.teamLogosId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_teams_id_idx").using("btree", table.teamsId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_user_memberships_id_idx").using("btree", table.userMembershipsId.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_users_id_idx").using("btree", table.usersId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userMembershipsId],
			foreignColumns: [userMemberships.id],
			name: "payload_locked_documents_rels_user_memberships_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.matchesId],
			foreignColumns: [matches.id],
			name: "payload_locked_documents_rels_matches_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.competitionSnapshotsId],
			foreignColumns: [competitionSnapshots.id],
			name: "payload_locked_documents_rels_competition_snapshots_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.miniLeaguesId],
			foreignColumns: [miniLeagues.id],
			name: "payload_locked_documents_rels_mini_leagues_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.feedbackId],
			foreignColumns: [feedback.id],
			name: "payload_locked_documents_rels_feedback_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.regionsId],
			foreignColumns: [regions.id],
			name: "payload_locked_documents_rels_regions_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamsId],
			foreignColumns: [teams.id],
			name: "payload_locked_documents_rels_teams_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.badgesId],
			foreignColumns: [badges.id],
			name: "payload_locked_documents_rels_badges_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.announcementsId],
			foreignColumns: [announcements.id],
			name: "payload_locked_documents_rels_announcements_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.leaguesId],
			foreignColumns: [leagues.id],
			name: "payload_locked_documents_rels_leagues_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.badgeMediaId],
			foreignColumns: [badgeMedia.id],
			name: "payload_locked_documents_rels_badge_media_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.competitionsId],
			foreignColumns: [competitions.id],
			name: "payload_locked_documents_rels_competitions_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.membershipTiersId],
			foreignColumns: [membershipTiers.id],
			name: "payload_locked_documents_rels_membership_tiers_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.leaderboardEntriesId],
			foreignColumns: [leaderboardEntries.id],
			name: "payload_locked_documents_rels_leaderboard_entries_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.countriesId],
			foreignColumns: [countries.id],
			name: "payload_locked_documents_rels_countries_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.mediaId],
			foreignColumns: [media.id],
			name: "payload_locked_documents_rels_media_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [payloadLockedDocuments.id],
			name: "payload_locked_documents_rels_parent_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.rateLimitsId],
			foreignColumns: [rateLimits.id],
			name: "payload_locked_documents_rels_rate_limits_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamLogosId],
			foreignColumns: [teamLogos.id],
			name: "payload_locked_documents_rels_team_logos_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.notificationSettingsId],
			foreignColumns: [notificationSettings.id],
			name: "payload_locked_documents_rels_notification_settings_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.predictionsId],
			foreignColumns: [predictions.id],
			name: "payload_locked_documents_rels_predictions_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.usersId],
			foreignColumns: [users.id],
			name: "payload_locked_documents_rels_users_id_fkey"
		}).onDelete("cascade"),
]);

export const usersRels = pgTable("users_rels", {
	id: integer().default(sql`nextval('users_rels_id_seq'::regclass)`).primaryKey().notNull(),
	order: integer(),
	parentId: varchar("parent_id").notNull(),
	path: varchar().notNull(),
	badgesId: varchar("badges_id"),
}, (table) => [
	index("users_rels_badges_id_idx").using("btree", table.badgesId.asc().nullsLast().op("text_ops")),
	index("users_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("users_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	index("users_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.badgesId],
			foreignColumns: [badges.id],
			name: "users_rels_badges_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [users.id],
			name: "users_rels_parent_id_fkey"
		}).onDelete("cascade"),
]);

export const teamsLocales = pgTable("teams_locales", {
	name: varchar().notNull(),
	shortName: varchar("short_name").notNull(),
	id: integer().default(sql`nextval('teams_locales_id_seq'::regclass)`).primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
}, (table) => [
	uniqueIndex("teams_locales_locale_parent_id_unique").using("btree", table.locale.asc().nullsLast().op("text_ops"), table.parentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [teams.id],
			name: "teams_locales__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const userMemberships = pgTable("user_memberships", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	tierId: varchar("tier_id").notNull(),
	status: enumUserMembershipsStatus().default('active').notNull(),
	validUntil: timestamp("valid_until", { precision: 3, withTimezone: true, mode: 'string' }),
	billingStripeSubscriptionId: varchar("billing_stripe_subscription_id"),
	billingLastPaymentDate: timestamp("billing_last_payment_date", { precision: 3, withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("user_memberships_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("user_memberships_tier_idx").using("btree", table.tierId.asc().nullsLast().op("text_ops")),
	index("user_memberships_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("user_memberships_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("user_memberships_valid_until_idx").using("btree", table.validUntil.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.tierId],
			foreignColumns: [membershipTiers.id],
			name: "user_memberships_tier_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_memberships_user_id_fkey"
		}).onDelete("set null"),
]);

export const rateLimits = pgTable("rate_limits", {
	id: integer().default(sql`nextval('rate_limits_id_seq'::regclass)`).primaryKey().notNull(),
	ip: varchar().notNull(),
	count: numeric().default('0').notNull(),
	lastRequest: timestamp("last_request", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("rate_limits_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("rate_limits_ip_idx").using("btree", table.ip.asc().nullsLast().op("text_ops")),
	index("rate_limits_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const usersSeenAnnouncements = pgTable("users_seen_announcements", {
	order: integer("_order").notNull(),
	parentId: varchar("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	announcementId: varchar("announcement_id"),
	displayCount: numeric("display_count").default('1'),
}, (table) => [
	index("users_seen_announcements_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("users_seen_announcements_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [users.id],
			name: "users_seen_announcements__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const usersSessions = pgTable("users_sessions", {
	order: integer("_order").notNull(),
	parentId: varchar("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("users_sessions_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("users_sessions_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [users.id],
			name: "users_sessions__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const usersLocales = pgTable("users_locales", {
	locationCountryId: integer("location_country_id"),
	locationCustomCountry: varchar("location_custom_country"),
	locationRegionId: integer("location_region_id"),
	id: integer().default(sql`nextval('users_locales_id_seq'::regclass)`).primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
}, (table) => [
	uniqueIndex("users_locales_locale_parent_id_unique").using("btree", table.locale.asc().nullsLast().op("enum_ops"), table.parentId.asc().nullsLast().op("text_ops")),
	index("users_location_location_country_idx").using("btree", table.locationCountryId.asc().nullsLast().op("int4_ops")),
	index("users_location_location_region_idx").using("btree", table.locationRegionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [users.id],
			name: "users_locales__parent_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.locationCountryId],
			foreignColumns: [countries.id],
			name: "users_locales_location_country_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.locationRegionId],
			foreignColumns: [regions.id],
			name: "users_locales_location_region_id_fkey"
		}).onDelete("set null"),
]);

export const payloadPreferences = pgTable("payload_preferences", {
	id: integer().default(sql`nextval('payload_preferences_id_seq'::regclass)`).primaryKey().notNull(),
	key: varchar(),
	value: jsonb(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("payload_preferences_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_preferences_key_idx").using("btree", table.key.asc().nullsLast().op("text_ops")),
	index("payload_preferences_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const teamLogos = pgTable("team_logos", {
	id: varchar().primaryKey().notNull(),
	alt: varchar().notNull(),
	prefix: varchar().default('team_logo'),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	url: varchar(),
	thumbnailURL: varchar("thumbnail_u_r_l"),
	filename: varchar(),
	mimeType: varchar("mime_type"),
	filesize: numeric(),
	width: numeric(),
	height: numeric(),
	focalX: numeric("focal_x"),
	focalY: numeric("focal_y"),
	sizesThumbnailUrl: varchar("sizes_thumbnail_url"),
	sizesThumbnailWidth: numeric("sizes_thumbnail_width"),
	sizesThumbnailHeight: numeric("sizes_thumbnail_height"),
	sizesThumbnailMimeType: varchar("sizes_thumbnail_mime_type"),
	sizesThumbnailFilesize: numeric("sizes_thumbnail_filesize"),
	sizesThumbnailFilename: varchar("sizes_thumbnail_filename"),
}, (table) => [
	index("team_logos_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("team_logos_filename_idx").using("btree", table.filename.asc().nullsLast().op("text_ops")),
	index("team_logos_sizes_thumbnail_sizes_thumbnail_filename_idx").using("btree", table.sizesThumbnailFilename.asc().nullsLast().op("text_ops")),
	index("team_logos_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const predictions = pgTable("predictions", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	matchId: varchar("match_id").notNull(),
	homeGoals: numeric("home_goals").notNull(),
	awayGoals: numeric("away_goals").notNull(),
	points: numeric().default('0'),
	status: enumPredictionsStatus().default('pending'),
	editCount: numeric("edit_count").default('1'),
	isExact: boolean("is_exact").default(false),
	isTrend: boolean("is_trend").default(false),
	isDiff: boolean("is_diff").default(false),
	isWrong: boolean("is_wrong").default(false),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("match_idx").using("btree", table.matchId.asc().nullsLast().op("text_ops")),
	index("predictions_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("predictions_match_idx").using("btree", table.matchId.asc().nullsLast().op("text_ops")),
	index("predictions_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("predictions_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	uniqueIndex("user_match_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.matchId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "predictions_user_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.id],
			name: "predictions_match_id_fkey"
		}).onDelete("set null"),
]);

export const notificationSettings = pgTable("notification_settings", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	dailySummary: boolean("daily_summary").default(false),
	matchReminder: boolean("match_reminder").default(false),
	scoreChange: boolean("score_change").default(false),
	matchEnd: boolean("match_end").default(false),
	leaderboardUpdate: boolean("leaderboard_update").default(false),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("notification_settings_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("notification_settings_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("notification_settings_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notification_settings_user_id_fkey"
		}).onDelete("set null"),
]);

export const payloadPreferencesRels = pgTable("payload_preferences_rels", {
	id: integer().default(sql`nextval('payload_preferences_rels_id_seq'::regclass)`).primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	usersId: varchar("users_id"),
}, (table) => [
	index("payload_preferences_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("payload_preferences_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	index("payload_preferences_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
	index("payload_preferences_rels_users_id_idx").using("btree", table.usersId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [payloadPreferences.id],
			name: "payload_preferences_rels_parent_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.usersId],
			foreignColumns: [users.id],
			name: "payload_preferences_rels_users_id_fkey"
		}).onDelete("cascade"),
]);

export const teamsLeagueTags = pgTable("teams_league_tags", {
	order: integer().notNull(),
	parentId: varchar("parent_id").notNull(),
	value: enumTeamsLeagueTags(),
	id: integer().default(sql`nextval('teams_league_tags_id_seq'::regclass)`).primaryKey().notNull(),
}, (table) => [
	index("teams_league_tags_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("teams_league_tags_parent_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [teams.id],
			name: "teams_league_tags_parent_id_fkey"
		}).onDelete("cascade"),
]);

export const generalSettingsLocales = pgTable("general_settings_locales", {
	gdprContent: jsonb("gdpr_content").notNull(),
	id: integer().default(sql`nextval('general_settings_locales_id_seq'::regclass)`).primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
}, (table) => [
	uniqueIndex("general_settings_locales_locale_parent_id_unique").using("btree", table.locale.asc().nullsLast().op("int4_ops"), table.parentId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [generalSettings.id],
			name: "general_settings_locales__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const payloadJobsLog = pgTable("payload_jobs_log", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	executedAt: timestamp("executed_at", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	completedAt: timestamp("completed_at", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	taskSlug: enumPayloadJobsLogTaskSlug("task_slug").notNull(),
	taskID: varchar("task_i_d").notNull(),
	input: jsonb(),
	output: jsonb(),
	state: enumPayloadJobsLogState().notNull(),
	error: jsonb(),
}, (table) => [
	index("payload_jobs_log_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("payload_jobs_log_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [payloadJobs.id],
			name: "payload_jobs_log__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	username: varchar().notNull(),
	role: enumUsersRole().default('user').notNull(),
	lastActivity: timestamp("last_activity", { precision: 3, withTimezone: true, mode: 'string' }),
	preferredLanguage: enumUsersPreferredLanguage("preferred_language").default('sk'),
	subscriptionPlan: enumUsersSubscriptionPlan("subscription_plan").default('free').notNull(),
	subscriptionPlanType: enumUsersSubscriptionPlanType("subscription_plan_type").default('seasonal').notNull(),
	subscriptionActiveFrom: timestamp("subscription_active_from", { precision: 3, withTimezone: true, mode: 'string' }),
	subscriptionActiveUntil: timestamp("subscription_active_until", { precision: 3, withTimezone: true, mode: 'string' }),
	hasSeenOnboarding: boolean("has_seen_onboarding").default(false),
	gdprConsent: boolean("gdpr_consent").default(false).notNull(),
	marketingConsent: boolean("marketing_consent").default(false),
	marketingConsentDate: timestamp("marketing_consent_date", { precision: 3, withTimezone: true, mode: 'string' }),
	statsGlobalRank: numeric("stats_global_rank"),
	statsPreviousRank: numeric("stats_previous_rank"),
	statsTrend: enumUsersStatsTrend("stats_trend"),
	referralDataReferralCode: varchar("referral_data_referral_code"),
	referralDataReferredById: varchar("referral_data_referred_by_id"),
	referralDataStatsTotalRegistered: numeric("referral_data_stats_total_registered").default('0'),
	referralDataStatsTotalPaid: numeric("referral_data_stats_total_paid").default('0'),
	jerseyPrimaryColor: varchar("jersey_primary_color").default('#ef4444'),
	jerseySecondaryColor: varchar("jersey_secondary_color").default('#ffffff'),
	jerseyPattern: enumUsersJerseyPattern("jersey_pattern").default('stripes'),
	jerseyNumber: varchar("jersey_number").default('10'),
	jerseyStyle: enumUsersJerseyStyle("jersey_style").default('classic'),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: varchar().notNull(),
	resetPasswordToken: varchar("reset_password_token"),
	resetPasswordExpiration: timestamp("reset_password_expiration", { precision: 3, withTimezone: true, mode: 'string' }),
	salt: varchar(),
	hash: varchar(),
	verified: boolean("_verified"),
	verificationtoken: varchar("_verificationtoken"),
	loginAttempts: numeric("login_attempts").default('0'),
	lockUntil: timestamp("lock_until", { precision: 3, withTimezone: true, mode: 'string' }),
	statsTotalPredictions: numeric("stats_total_predictions").default('0'),
	statsLifetimePoints: numeric("stats_lifetime_points").default('0'),
	statsLifetimePossiblePoints: numeric("stats_lifetime_possible_points").default('0'),
	statsCurrentOvr: numeric("stats_current_ovr").default('0'),
	statsMaxOvrEver: numeric("stats_max_ovr_ever").default('0'),
}, (table) => [
	index("users_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("users_referral_data_referral_data_referral_code_idx").using("btree", table.referralDataReferralCode.asc().nullsLast().op("text_ops")),
	index("users_referral_data_referral_data_referred_by_idx").using("btree", table.referralDataReferredById.asc().nullsLast().op("text_ops")),
	index("users_stats_stats_global_rank_idx").using("btree", table.statsGlobalRank.asc().nullsLast().op("numeric_ops")),
	index("users_subscription_subscription_active_until_idx").using("btree", table.subscriptionActiveUntil.asc().nullsLast().op("timestamptz_ops")),
	index("users_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("users_username_idx").using("btree", table.username.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.referralDataReferredById],
			foreignColumns: [table.id],
			name: "users_referral_data_referred_by_id_fkey"
		}).onDelete("set null"),
]);

export const badges = pgTable("badges", {
	id: varchar().primaryKey().notNull(),
	slug: varchar().notNull(),
	iconType: enumBadgesIconType("icon_type").default('lucide'),
	iconLucide: varchar("icon_lucide"),
	iconMediaId: varchar("icon_media_id"),
	weight: numeric().default('1'),
	rarity: enumBadgesRarity().default('bronze'),
	isAutomatic: boolean("is_automatic").default(false),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("badges_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("badges_icon_media_idx").using("btree", table.iconMediaId.asc().nullsLast().op("text_ops")),
	uniqueIndex("badges_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("badges_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.iconMediaId],
			foreignColumns: [badgeMedia.id],
			name: "badges_icon_media_id_fkey"
		}).onDelete("set null"),
]);

export const competitionsRels = pgTable("competitions_rels", {
	id: integer().default(sql`nextval('competitions_rels_id_seq'::regclass)`).primaryKey().notNull(),
	order: integer(),
	parentId: varchar("parent_id").notNull(),
	path: varchar().notNull(),
	membershipTiersId: varchar("membership_tiers_id"),
}, (table) => [
	index("competitions_rels_membership_tiers_id_idx").using("btree", table.membershipTiersId.asc().nullsLast().op("text_ops")),
	index("competitions_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("competitions_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	index("competitions_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [competitions.id],
			name: "competitions_rels_parent_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.membershipTiersId],
			foreignColumns: [membershipTiers.id],
			name: "competitions_rels_membership_tiers_id_fkey"
		}).onDelete("cascade"),
]);

export const membershipTiers = pgTable("membership_tiers", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	rank: numeric().notNull(),
	price: numeric().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("membership_tiers_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("membership_tiers_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const countriesLocales = pgTable("countries_locales", {
	name: varchar().notNull(),
	id: integer().default(sql`nextval('countries_locales_id_seq'::regclass)`).primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
}, (table) => [
	uniqueIndex("countries_locales_locale_parent_id_unique").using("btree", table.locale.asc().nullsLast().op("int4_ops"), table.parentId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [countries.id],
			name: "countries_locales__parent_id_fkey"
		}).onDelete("cascade"),
]);

export const regions = pgTable("regions", {
	id: integer().default(sql`nextval('regions_id_seq'::regclass)`).primaryKey().notNull(),
	countryId: integer("country_id").notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("regions_country_idx").using("btree", table.countryId.asc().nullsLast().op("int4_ops")),
	index("regions_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("regions_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [countries.id],
			name: "regions_country_id_fkey"
		}).onDelete("set null"),
]);
