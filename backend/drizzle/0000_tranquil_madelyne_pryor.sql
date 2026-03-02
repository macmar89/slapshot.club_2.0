-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."_locales" AS ENUM('sk', 'en', 'cz');--> statement-breakpoint
CREATE TYPE "public"."enum_announcements_icon" AS ENUM('bell', 'trophy', 'star', 'gift', 'alert');--> statement-breakpoint
CREATE TYPE "public"."enum_announcements_targeting_target_roles" AS ENUM('admin', 'editor', 'user');--> statement-breakpoint
CREATE TYPE "public"."enum_badges_icon_type" AS ENUM('lucide', 'upload');--> statement-breakpoint
CREATE TYPE "public"."enum_badges_rarity" AS ENUM('bronze', 'silver', 'gold', 'platinum');--> statement-breakpoint
CREATE TYPE "public"."enum_competitions_status" AS ENUM('upcoming', 'active', 'finished');--> statement-breakpoint
CREATE TYPE "public"."enum_feedback_status" AS ENUM('new', 'in-progress', 'resolved', 'ignored');--> statement-breakpoint
CREATE TYPE "public"."enum_feedback_type" AS ENUM('bug', 'idea', 'change_user_email_request', 'custom_country_request', 'other');--> statement-breakpoint
CREATE TYPE "public"."enum_leagues_type" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TYPE "public"."enum_matches_result_ending_type" AS ENUM('regular', 'ot', 'so');--> statement-breakpoint
CREATE TYPE "public"."enum_matches_result_stage_type" AS ENUM('regular_season', 'group_phase', 'playoffs', 'pre_season');--> statement-breakpoint
CREATE TYPE "public"."enum_matches_status" AS ENUM('scheduled', 'live', 'finished', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');--> statement-breakpoint
CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'update-matches', 'update-realtime-ranking', 'sync-hockey-matches', 'sync-future-matches', 'sync-teams', 'update-leaderboards', 'evaluate-match', 'send-push-notification');--> statement-breakpoint
CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'update-matches', 'update-realtime-ranking', 'sync-hockey-matches', 'sync-future-matches', 'sync-teams', 'update-leaderboards', 'evaluate-match', 'send-push-notification');--> statement-breakpoint
CREATE TYPE "public"."enum_predictions_status" AS ENUM('pending', 'evaluated', 'void');--> statement-breakpoint
CREATE TYPE "public"."enum_teams_country" AS ENUM('SVK', 'CZE', 'USA', 'CAN');--> statement-breakpoint
CREATE TYPE "public"."enum_teams_league_tags" AS ENUM('sk', 'nhl', 'cz', 'khl', 'sk1', 'iihf');--> statement-breakpoint
CREATE TYPE "public"."enum_teams_type" AS ENUM('club', 'national');--> statement-breakpoint
CREATE TYPE "public"."enum_user_memberships_status" AS ENUM('active', 'pending', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."enum_users_jersey_pattern" AS ENUM('stripes', 'bands', 'plain', 'chevrons', 'hoops');--> statement-breakpoint
CREATE TYPE "public"."enum_users_jersey_style" AS ENUM('classic', 'modern');--> statement-breakpoint
CREATE TYPE "public"."enum_users_preferred_language" AS ENUM('sk', 'en', 'cz');--> statement-breakpoint
CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'user');--> statement-breakpoint
CREATE TYPE "public"."enum_users_stats_trend" AS ENUM('up', 'down', 'stable');--> statement-breakpoint
CREATE TYPE "public"."enum_users_subscription_plan" AS ENUM('free', 'pro', 'vip');--> statement-breakpoint
CREATE TYPE "public"."enum_users_subscription_plan_type" AS ENUM('seasonal', 'lifetime');--> statement-breakpoint
CREATE SEQUENCE "public"."payload_jobs_stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."payload_jobs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."announcements_locales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."announcements_targeting_target_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."badges_locales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."competitions_locales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."competitions_rels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."countries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."countries_locales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."announcements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."general_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."leagues_rels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."mini_leagues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."mini_leagues_rels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."payload_locked_documents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."payload_kv_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."payload_migrations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."payload_locked_documents_rels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."regions_locales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."rate_limits_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."regions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."teams_locales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."payload_preferences_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."users_rels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."users_locales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."general_settings_locales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."payload_preferences_rels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."teams_league_tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "competition_snapshots" (
	"id" varchar PRIMARY KEY NOT NULL,
	"competition_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"rank" numeric NOT NULL,
	"ovr" numeric NOT NULL,
	"points" numeric NOT NULL,
	"exact_guesses" numeric DEFAULT '0',
	"winner_diff" numeric DEFAULT '0',
	"winner" numeric DEFAULT '0',
	"adjacent" numeric DEFAULT '0',
	"total_tips" numeric DEFAULT '0',
	"date" timestamp(3) with time zone NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload_jobs_stats" (
	"id" integer PRIMARY KEY DEFAULT nextval('payload_jobs_stats_id_seq'::regclass) NOT NULL,
	"stats" jsonb,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar,
	"banner_id" varchar,
	"status" "enum_competitions_status" DEFAULT 'upcoming' NOT NULL,
	"is_registration_open" boolean DEFAULT false,
	"start_date" timestamp(3) with time zone NOT NULL,
	"end_date" timestamp(3) with time zone NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"total_played_matches" numeric DEFAULT '0',
	"total_possible_points" numeric DEFAULT '0',
	"recalculation_hour" numeric DEFAULT '5',
	"api_hockey_id" varchar,
	"api_hockey_season" numeric
);
--> statement-breakpoint
CREATE TABLE "announcements_locales" (
	"title" varchar NOT NULL,
	"content" varchar NOT NULL,
	"button_text" varchar DEFAULT 'OK',
	"id" integer PRIMARY KEY DEFAULT nextval('announcements_locales_id_seq'::regclass) NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements_targeting_target_roles" (
	"order" integer NOT NULL,
	"parent_id" integer NOT NULL,
	"value" "enum_announcements_targeting_target_roles",
	"id" integer PRIMARY KEY DEFAULT nextval('announcements_targeting_target_roles_id_seq'::regclass) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitions_locales" (
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"id" integer PRIMARY KEY DEFAULT nextval('competitions_locales_id_seq'::regclass) NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges_locales" (
	"name" varchar NOT NULL,
	"description" varchar,
	"id" integer PRIMARY KEY DEFAULT nextval('badges_locales_id_seq'::regclass) NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload_jobs" (
	"id" integer PRIMARY KEY DEFAULT nextval('payload_jobs_id_seq'::regclass) NOT NULL,
	"input" jsonb,
	"completed_at" timestamp(3) with time zone,
	"total_tried" numeric DEFAULT '0',
	"has_error" boolean DEFAULT false,
	"error" jsonb,
	"task_slug" "enum_payload_jobs_task_slug",
	"queue" varchar DEFAULT 'default',
	"wait_until" timestamp(3) with time zone,
	"processing" boolean DEFAULT false,
	"meta" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" varchar PRIMARY KEY NOT NULL,
	"type" "enum_feedback_type" DEFAULT 'idea' NOT NULL,
	"message" varchar NOT NULL,
	"page_url" varchar,
	"user_id" varchar,
	"read" boolean DEFAULT false,
	"status" "enum_feedback_status" DEFAULT 'new',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" integer PRIMARY KEY DEFAULT nextval('countries_id_seq'::regclass) NOT NULL,
	"code" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" integer PRIMARY KEY DEFAULT nextval('announcements_id_seq'::regclass) NOT NULL,
	"name" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"image_id" varchar,
	"max_displays_per_user" numeric DEFAULT '1',
	"targeting_min_points" numeric,
	"targeting_max_points" numeric,
	"icon" "enum_announcements_icon" DEFAULT 'bell',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"type" "enum_leagues_type" DEFAULT 'private' NOT NULL,
	"code" varchar,
	"owner_id" varchar NOT NULL,
	"competition_id" varchar NOT NULL,
	"max_members" numeric DEFAULT '30' NOT NULL,
	"stats_average_score" numeric DEFAULT '0',
	"stats_total_score" numeric DEFAULT '0',
	"stats_member_count" numeric DEFAULT '1',
	"stats_rank" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leagues_rels" (
	"id" integer PRIMARY KEY DEFAULT nextval('leagues_rels_id_seq'::regclass) NOT NULL,
	"order" integer,
	"parent_id" varchar NOT NULL,
	"path" varchar NOT NULL,
	"users_id" varchar
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" varchar PRIMARY KEY NOT NULL,
	"display_title" varchar,
	"competition_id" varchar NOT NULL,
	"date" timestamp(3) with time zone NOT NULL,
	"home_team_id" varchar NOT NULL,
	"away_team_id" varchar NOT NULL,
	"status" "enum_matches_status" DEFAULT 'scheduled' NOT NULL,
	"result_stage_type" "enum_matches_result_stage_type" DEFAULT 'regular_season' NOT NULL,
	"result_home_score" numeric DEFAULT '0',
	"result_away_score" numeric DEFAULT '0',
	"result_ending_type" "enum_matches_result_ending_type" DEFAULT 'regular',
	"result_round_label" varchar,
	"result_round_order" numeric,
	"result_group_name" varchar,
	"result_series_game_number" numeric,
	"result_series_state" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"ranked_at" timestamp(3) with time zone,
	"api_hockey_id" varchar,
	"api_hockey_status" varchar
);
--> statement-breakpoint
CREATE TABLE "membership_tiers_features" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE "mini_leagues" (
	"id" integer PRIMARY KEY DEFAULT nextval('mini_leagues_id_seq'::regclass) NOT NULL,
	"name" varchar NOT NULL,
	"competition_id" varchar NOT NULL,
	"owner_id" varchar NOT NULL,
	"invite_code" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badge_media" (
	"id" varchar PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"prefix" varchar DEFAULT 'badge',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumbnail_url" varchar,
	"sizes_thumbnail_width" numeric,
	"sizes_thumbnail_height" numeric,
	"sizes_thumbnail_mime_type" varchar,
	"sizes_thumbnail_filesize" numeric,
	"sizes_thumbnail_filename" varchar,
	"sizes_badge_url" varchar,
	"sizes_badge_width" numeric,
	"sizes_badge_height" numeric,
	"sizes_badge_mime_type" varchar,
	"sizes_badge_filesize" numeric,
	"sizes_badge_filename" varchar
);
--> statement-breakpoint
CREATE TABLE "general_settings" (
	"id" integer PRIMARY KEY DEFAULT nextval('general_settings_id_seq'::regclass) NOT NULL,
	"seo_title" varchar,
	"seo_description" varchar,
	"seo_image_id" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone,
	"cron_settings_update_matches_enabled" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"competition_id" varchar NOT NULL,
	"total_points" numeric DEFAULT '0',
	"total_matches" numeric DEFAULT '0',
	"exact_guesses" numeric DEFAULT '0',
	"correct_trends" numeric DEFAULT '0',
	"correct_diffs" numeric DEFAULT '0',
	"wrong_guesses" numeric DEFAULT '0',
	"current_rank" numeric,
	"previous_rank" numeric,
	"rank_change" numeric,
	"active_league_id" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"ovr" numeric
);
--> statement-breakpoint
CREATE TABLE "mini_leagues_rels" (
	"id" integer PRIMARY KEY DEFAULT nextval('mini_leagues_rels_id_seq'::regclass) NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" varchar
);
--> statement-breakpoint
CREATE TABLE "payload_locked_documents" (
	"id" integer PRIMARY KEY DEFAULT nextval('payload_locked_documents_id_seq'::regclass) NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload_kv" (
	"id" integer PRIMARY KEY DEFAULT nextval('payload_kv_id_seq'::regclass) NOT NULL,
	"key" varchar NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" varchar PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric
);
--> statement-breakpoint
CREATE TABLE "payload_migrations" (
	"id" integer PRIMARY KEY DEFAULT nextval('payload_migrations_id_seq'::regclass) NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions_locales" (
	"name" varchar NOT NULL,
	"id" integer PRIMARY KEY DEFAULT nextval('regions_locales_id_seq'::regclass) NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar,
	"type" "enum_teams_type" DEFAULT 'club' NOT NULL,
	"country" "enum_teams_country",
	"logo_id" varchar,
	"colors_primary" varchar DEFAULT '#000000' NOT NULL,
	"colors_secondary" varchar DEFAULT '#ffffff' NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"api_hockey_id" varchar
);
--> statement-breakpoint
CREATE TABLE "payload_locked_documents_rels" (
	"id" integer PRIMARY KEY DEFAULT nextval('payload_locked_documents_rels_id_seq'::regclass) NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" varchar,
	"media_id" varchar,
	"competitions_id" varchar,
	"feedback_id" varchar,
	"membership_tiers_id" varchar,
	"user_memberships_id" varchar,
	"leaderboard_entries_id" varchar,
	"teams_id" varchar,
	"matches_id" varchar,
	"predictions_id" varchar,
	"leagues_id" varchar,
	"mini_leagues_id" integer,
	"team_logos_id" varchar,
	"rate_limits_id" integer,
	"announcements_id" integer,
	"countries_id" integer,
	"regions_id" integer,
	"badges_id" varchar,
	"badge_media_id" varchar,
	"competition_snapshots_id" varchar,
	"notification_settings_id" varchar
);
--> statement-breakpoint
CREATE TABLE "users_rels" (
	"id" integer PRIMARY KEY DEFAULT nextval('users_rels_id_seq'::regclass) NOT NULL,
	"order" integer,
	"parent_id" varchar NOT NULL,
	"path" varchar NOT NULL,
	"badges_id" varchar
);
--> statement-breakpoint
CREATE TABLE "teams_locales" (
	"name" varchar NOT NULL,
	"short_name" varchar NOT NULL,
	"id" integer PRIMARY KEY DEFAULT nextval('teams_locales_id_seq'::regclass) NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_memberships" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"tier_id" varchar NOT NULL,
	"status" "enum_user_memberships_status" DEFAULT 'active' NOT NULL,
	"valid_until" timestamp(3) with time zone,
	"billing_stripe_subscription_id" varchar,
	"billing_last_payment_date" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" integer PRIMARY KEY DEFAULT nextval('rate_limits_id_seq'::regclass) NOT NULL,
	"ip" varchar NOT NULL,
	"count" numeric DEFAULT '0' NOT NULL,
	"last_request" timestamp(3) with time zone NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_seen_announcements" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"announcement_id" varchar,
	"display_count" numeric DEFAULT '1'
);
--> statement-breakpoint
CREATE TABLE "users_sessions" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_locales" (
	"location_country_id" integer,
	"location_custom_country" varchar,
	"location_region_id" integer,
	"id" integer PRIMARY KEY DEFAULT nextval('users_locales_id_seq'::regclass) NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload_preferences" (
	"id" integer PRIMARY KEY DEFAULT nextval('payload_preferences_id_seq'::regclass) NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_logos" (
	"id" varchar PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"prefix" varchar DEFAULT 'team_logo',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumbnail_url" varchar,
	"sizes_thumbnail_width" numeric,
	"sizes_thumbnail_height" numeric,
	"sizes_thumbnail_mime_type" varchar,
	"sizes_thumbnail_filesize" numeric,
	"sizes_thumbnail_filename" varchar
);
--> statement-breakpoint
CREATE TABLE "predictions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"match_id" varchar NOT NULL,
	"home_goals" numeric NOT NULL,
	"away_goals" numeric NOT NULL,
	"points" numeric DEFAULT '0',
	"status" "enum_predictions_status" DEFAULT 'pending',
	"edit_count" numeric DEFAULT '1',
	"is_exact" boolean DEFAULT false,
	"is_trend" boolean DEFAULT false,
	"is_diff" boolean DEFAULT false,
	"is_wrong" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_settings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"daily_summary" boolean DEFAULT false,
	"match_reminder" boolean DEFAULT false,
	"score_change" boolean DEFAULT false,
	"match_end" boolean DEFAULT false,
	"leaderboard_update" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload_preferences_rels" (
	"id" integer PRIMARY KEY DEFAULT nextval('payload_preferences_rels_id_seq'::regclass) NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" varchar
);
--> statement-breakpoint
CREATE TABLE "teams_league_tags" (
	"order" integer NOT NULL,
	"parent_id" varchar NOT NULL,
	"value" "enum_teams_league_tags",
	"id" integer PRIMARY KEY DEFAULT nextval('teams_league_tags_id_seq'::regclass) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "general_settings_locales" (
	"gdpr_content" jsonb NOT NULL,
	"id" integer PRIMARY KEY DEFAULT nextval('general_settings_locales_id_seq'::regclass) NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload_jobs_log" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"executed_at" timestamp(3) with time zone NOT NULL,
	"completed_at" timestamp(3) with time zone NOT NULL,
	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
	"task_i_d" varchar NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"state" "enum_payload_jobs_log_state" NOT NULL,
	"error" jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"role" "enum_users_role" DEFAULT 'user' NOT NULL,
	"last_activity" timestamp(3) with time zone,
	"preferred_language" "enum_users_preferred_language" DEFAULT 'sk',
	"subscription_plan" "enum_users_subscription_plan" DEFAULT 'free' NOT NULL,
	"subscription_plan_type" "enum_users_subscription_plan_type" DEFAULT 'seasonal' NOT NULL,
	"subscription_active_from" timestamp(3) with time zone,
	"subscription_active_until" timestamp(3) with time zone,
	"has_seen_onboarding" boolean DEFAULT false,
	"gdpr_consent" boolean DEFAULT false NOT NULL,
	"marketing_consent" boolean DEFAULT false,
	"marketing_consent_date" timestamp(3) with time zone,
	"stats_global_rank" numeric,
	"stats_previous_rank" numeric,
	"stats_trend" "enum_users_stats_trend",
	"referral_data_referral_code" varchar,
	"referral_data_referred_by_id" varchar,
	"referral_data_stats_total_registered" numeric DEFAULT '0',
	"referral_data_stats_total_paid" numeric DEFAULT '0',
	"jersey_primary_color" varchar DEFAULT '#ef4444',
	"jersey_secondary_color" varchar DEFAULT '#ffffff',
	"jersey_pattern" "enum_users_jersey_pattern" DEFAULT 'stripes',
	"jersey_number" varchar DEFAULT '10',
	"jersey_style" "enum_users_jersey_style" DEFAULT 'classic',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"_verified" boolean,
	"_verificationtoken" varchar,
	"login_attempts" numeric DEFAULT '0',
	"lock_until" timestamp(3) with time zone,
	"stats_total_predictions" numeric DEFAULT '0',
	"stats_lifetime_points" numeric DEFAULT '0',
	"stats_lifetime_possible_points" numeric DEFAULT '0',
	"stats_current_ovr" numeric DEFAULT '0',
	"stats_max_ovr_ever" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"icon_type" "enum_badges_icon_type" DEFAULT 'lucide',
	"icon_lucide" varchar,
	"icon_media_id" varchar,
	"weight" numeric DEFAULT '1',
	"rarity" "enum_badges_rarity" DEFAULT 'bronze',
	"is_automatic" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitions_rels" (
	"id" integer PRIMARY KEY DEFAULT nextval('competitions_rels_id_seq'::regclass) NOT NULL,
	"order" integer,
	"parent_id" varchar NOT NULL,
	"path" varchar NOT NULL,
	"membership_tiers_id" varchar
);
--> statement-breakpoint
CREATE TABLE "membership_tiers" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"rank" numeric NOT NULL,
	"price" numeric NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries_locales" (
	"name" varchar NOT NULL,
	"id" integer PRIMARY KEY DEFAULT nextval('countries_locales_id_seq'::regclass) NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" integer PRIMARY KEY DEFAULT nextval('regions_id_seq'::regclass) NOT NULL,
	"country_id" integer NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competition_snapshots" ADD CONSTRAINT "competition_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_snapshots" ADD CONSTRAINT "competition_snapshots_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements_locales" ADD CONSTRAINT "announcements_locales__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements_targeting_target_roles" ADD CONSTRAINT "announcements_targeting_target_roles_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions_locales" ADD CONSTRAINT "competitions_locales__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges_locales" ADD CONSTRAINT "badges_locales__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagues_rels" ADD CONSTRAINT "leagues_rels_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagues_rels" ADD CONSTRAINT "leagues_rels_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_tiers_features" ADD CONSTRAINT "membership_tiers_features__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_tiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mini_leagues" ADD CONSTRAINT "mini_leagues_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mini_leagues" ADD CONSTRAINT "mini_leagues_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_settings" ADD CONSTRAINT "general_settings_seo_image_id_fkey" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_active_league_id_fkey" FOREIGN KEY ("active_league_id") REFERENCES "public"."leagues"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mini_leagues_rels" ADD CONSTRAINT "mini_leagues_rels_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."mini_leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mini_leagues_rels" ADD CONSTRAINT "mini_leagues_rels_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions_locales" ADD CONSTRAINT "regions_locales__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "public"."team_logos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_memberships_id_fkey" FOREIGN KEY ("user_memberships_id") REFERENCES "public"."user_memberships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_matches_id_fkey" FOREIGN KEY ("matches_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_competition_snapshots_id_fkey" FOREIGN KEY ("competition_snapshots_id") REFERENCES "public"."competition_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mini_leagues_id_fkey" FOREIGN KEY ("mini_leagues_id") REFERENCES "public"."mini_leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_id_fkey" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teams_id_fkey" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_badges_id_fkey" FOREIGN KEY ("badges_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_id_fkey" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leagues_id_fkey" FOREIGN KEY ("leagues_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_badge_media_id_fkey" FOREIGN KEY ("badge_media_id") REFERENCES "public"."badge_media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_competitions_id_fkey" FOREIGN KEY ("competitions_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_membership_tiers_id_fkey" FOREIGN KEY ("membership_tiers_id") REFERENCES "public"."membership_tiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leaderboard_entries_id_fkey" FOREIGN KEY ("leaderboard_entries_id") REFERENCES "public"."leaderboard_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_id_fkey" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rate_limits_id_fkey" FOREIGN KEY ("rate_limits_id") REFERENCES "public"."rate_limits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_logos_id_fkey" FOREIGN KEY ("team_logos_id") REFERENCES "public"."team_logos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notification_settings_id_fkey" FOREIGN KEY ("notification_settings_id") REFERENCES "public"."notification_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_predictions_id_fkey" FOREIGN KEY ("predictions_id") REFERENCES "public"."predictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_badges_id_fkey" FOREIGN KEY ("badges_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_locales" ADD CONSTRAINT "teams_locales__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_memberships" ADD CONSTRAINT "user_memberships_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "public"."membership_tiers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_memberships" ADD CONSTRAINT "user_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_seen_announcements" ADD CONSTRAINT "users_seen_announcements__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_location_country_id_fkey" FOREIGN KEY ("location_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_location_region_id_fkey" FOREIGN KEY ("location_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_league_tags" ADD CONSTRAINT "teams_league_tags_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_settings_locales" ADD CONSTRAINT "general_settings_locales__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."general_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_referral_data_referred_by_id_fkey" FOREIGN KEY ("referral_data_referred_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_icon_media_id_fkey" FOREIGN KEY ("icon_media_id") REFERENCES "public"."badge_media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions_rels" ADD CONSTRAINT "competitions_rels_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions_rels" ADD CONSTRAINT "competitions_rels_membership_tiers_id_fkey" FOREIGN KEY ("membership_tiers_id") REFERENCES "public"."membership_tiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "countries_locales" ADD CONSTRAINT "countries_locales__parent_id_fkey" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "competition_date_idx" ON "competition_snapshots" USING btree ("competition_id" timestamptz_ops,"date" text_ops);--> statement-breakpoint
CREATE INDEX "competition_snapshots_competition_idx" ON "competition_snapshots" USING btree ("competition_id" text_ops);--> statement-breakpoint
CREATE INDEX "competition_snapshots_created_at_idx" ON "competition_snapshots" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "competition_snapshots_updated_at_idx" ON "competition_snapshots" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "competition_snapshots_user_idx" ON "competition_snapshots" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "user_competition_1_idx" ON "competition_snapshots" USING btree ("user_id" text_ops,"competition_id" text_ops);--> statement-breakpoint
CREATE INDEX "competitions_banner_idx" ON "competitions" USING btree ("banner_id" text_ops);--> statement-breakpoint
CREATE INDEX "competitions_created_at_idx" ON "competitions" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "competitions_slug_idx" ON "competitions" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "competitions_updated_at_idx" ON "competitions" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "announcements_locales_locale_parent_id_unique" ON "announcements_locales" USING btree ("_locale" int4_ops,"_parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "announcements_targeting_target_roles_order_idx" ON "announcements_targeting_target_roles" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "announcements_targeting_target_roles_parent_idx" ON "announcements_targeting_target_roles" USING btree ("parent_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "competitions_locales_locale_parent_id_unique" ON "competitions_locales" USING btree ("_locale" text_ops,"_parent_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "badges_locales_locale_parent_id_unique" ON "badges_locales" USING btree ("_locale" text_ops,"_parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error" bool_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing" bool_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue" text_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug" enum_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried" numeric_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "feedback_updated_at_idx" ON "feedback" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "feedback_user_idx" ON "feedback" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "announcements_image_idx" ON "announcements" USING btree ("image_id" text_ops);--> statement-breakpoint
CREATE INDEX "announcements_is_active_idx" ON "announcements" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "leagues_code_idx" ON "leagues" USING btree ("code" text_ops);--> statement-breakpoint
CREATE INDEX "leagues_competition_idx" ON "leagues" USING btree ("competition_id" text_ops);--> statement-breakpoint
CREATE INDEX "leagues_created_at_idx" ON "leagues" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "leagues_name_idx" ON "leagues" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "leagues_owner_idx" ON "leagues" USING btree ("owner_id" text_ops);--> statement-breakpoint
CREATE INDEX "leagues_updated_at_idx" ON "leagues" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "leagues_rels_order_idx" ON "leagues_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "leagues_rels_parent_idx" ON "leagues_rels" USING btree ("parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "leagues_rels_path_idx" ON "leagues_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE INDEX "leagues_rels_users_id_idx" ON "leagues_rels" USING btree ("users_id" text_ops);--> statement-breakpoint
CREATE INDEX "matches_away_team_idx" ON "matches" USING btree ("away_team_id" text_ops);--> statement-breakpoint
CREATE INDEX "matches_competition_idx" ON "matches" USING btree ("competition_id" text_ops);--> statement-breakpoint
CREATE INDEX "matches_created_at_idx" ON "matches" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "matches_date_idx" ON "matches" USING btree ("date" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "matches_home_team_idx" ON "matches" USING btree ("home_team_id" text_ops);--> statement-breakpoint
CREATE INDEX "matches_updated_at_idx" ON "matches" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "membership_tiers_features_order_idx" ON "membership_tiers_features" USING btree ("_order" int4_ops);--> statement-breakpoint
CREATE INDEX "membership_tiers_features_parent_id_idx" ON "membership_tiers_features" USING btree ("_parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "mini_leagues_competition_idx" ON "mini_leagues" USING btree ("competition_id" text_ops);--> statement-breakpoint
CREATE INDEX "mini_leagues_created_at_idx" ON "mini_leagues" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "mini_leagues_invite_code_idx" ON "mini_leagues" USING btree ("invite_code" text_ops);--> statement-breakpoint
CREATE INDEX "mini_leagues_owner_idx" ON "mini_leagues" USING btree ("owner_id" text_ops);--> statement-breakpoint
CREATE INDEX "mini_leagues_updated_at_idx" ON "mini_leagues" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "badge_media_created_at_idx" ON "badge_media" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "badge_media_filename_idx" ON "badge_media" USING btree ("filename" text_ops);--> statement-breakpoint
CREATE INDEX "badge_media_sizes_badge_sizes_badge_filename_idx" ON "badge_media" USING btree ("sizes_badge_filename" text_ops);--> statement-breakpoint
CREATE INDEX "badge_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "badge_media" USING btree ("sizes_thumbnail_filename" text_ops);--> statement-breakpoint
CREATE INDEX "badge_media_updated_at_idx" ON "badge_media" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "general_settings_seo_seo_image_idx" ON "general_settings" USING btree ("seo_image_id" text_ops);--> statement-breakpoint
CREATE INDEX "competition_totalPoints_idx" ON "leaderboard_entries" USING btree ("competition_id" numeric_ops,"total_points" numeric_ops);--> statement-breakpoint
CREATE INDEX "leaderboard_entries_active_league_idx" ON "leaderboard_entries" USING btree ("active_league_id" text_ops);--> statement-breakpoint
CREATE INDEX "leaderboard_entries_competition_idx" ON "leaderboard_entries" USING btree ("competition_id" text_ops);--> statement-breakpoint
CREATE INDEX "leaderboard_entries_created_at_idx" ON "leaderboard_entries" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "leaderboard_entries_current_rank_idx" ON "leaderboard_entries" USING btree ("current_rank" numeric_ops);--> statement-breakpoint
CREATE INDEX "leaderboard_entries_total_matches_idx" ON "leaderboard_entries" USING btree ("total_matches" numeric_ops);--> statement-breakpoint
CREATE INDEX "leaderboard_entries_total_points_idx" ON "leaderboard_entries" USING btree ("total_points" numeric_ops);--> statement-breakpoint
CREATE INDEX "leaderboard_entries_updated_at_idx" ON "leaderboard_entries" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "leaderboard_entries_user_idx" ON "leaderboard_entries" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "user_competition_idx" ON "leaderboard_entries" USING btree ("user_id" text_ops,"competition_id" text_ops);--> statement-breakpoint
CREATE INDEX "mini_leagues_rels_order_idx" ON "mini_leagues_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "mini_leagues_rels_parent_idx" ON "mini_leagues_rels" USING btree ("parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "mini_leagues_rels_path_idx" ON "mini_leagues_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE INDEX "mini_leagues_rels_users_id_idx" ON "mini_leagues_rels" USING btree ("users_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename" text_ops);--> statement-breakpoint
CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "regions_locales_locale_parent_id_unique" ON "regions_locales" USING btree ("_locale" int4_ops,"_parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "teams_created_at_idx" ON "teams" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "teams_logo_idx" ON "teams" USING btree ("logo_id" text_ops);--> statement-breakpoint
CREATE INDEX "teams_updated_at_idx" ON "teams" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_badge_media_id_idx" ON "payload_locked_documents_rels" USING btree ("badge_media_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_badges_id_idx" ON "payload_locked_documents_rels" USING btree ("badges_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_competition_snapshots_id_idx" ON "payload_locked_documents_rels" USING btree ("competition_snapshots_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_competitions_id_idx" ON "payload_locked_documents_rels" USING btree ("competitions_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_feedback_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_leaderboard_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("leaderboard_entries_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_leagues_id_idx" ON "payload_locked_documents_rels" USING btree ("leagues_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_matches_id_idx" ON "payload_locked_documents_rels" USING btree ("matches_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_membership_tiers_id_idx" ON "payload_locked_documents_rels" USING btree ("membership_tiers_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_mini_leagues_id_idx" ON "payload_locked_documents_rels" USING btree ("mini_leagues_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_notification_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("notification_settings_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_predictions_id_idx" ON "payload_locked_documents_rels" USING btree ("predictions_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_rate_limits_id_idx" ON "payload_locked_documents_rels" USING btree ("rate_limits_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_team_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("team_logos_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_teams_id_idx" ON "payload_locked_documents_rels" USING btree ("teams_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_user_memberships_id_idx" ON "payload_locked_documents_rels" USING btree ("user_memberships_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id" text_ops);--> statement-breakpoint
CREATE INDEX "users_rels_badges_id_idx" ON "users_rels" USING btree ("badges_id" text_ops);--> statement-breakpoint
CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "teams_locales_locale_parent_id_unique" ON "teams_locales" USING btree ("_locale" text_ops,"_parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "user_memberships_created_at_idx" ON "user_memberships" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "user_memberships_tier_idx" ON "user_memberships" USING btree ("tier_id" text_ops);--> statement-breakpoint
CREATE INDEX "user_memberships_updated_at_idx" ON "user_memberships" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "user_memberships_user_idx" ON "user_memberships" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "user_memberships_valid_until_idx" ON "user_memberships" USING btree ("valid_until" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "rate_limits_created_at_idx" ON "rate_limits" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "rate_limits_ip_idx" ON "rate_limits" USING btree ("ip" text_ops);--> statement-breakpoint
CREATE INDEX "rate_limits_updated_at_idx" ON "rate_limits" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "users_seen_announcements_order_idx" ON "users_seen_announcements" USING btree ("_order" int4_ops);--> statement-breakpoint
CREATE INDEX "users_seen_announcements_parent_id_idx" ON "users_seen_announcements" USING btree ("_parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order" int4_ops);--> statement-breakpoint
CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "users_locales_locale_parent_id_unique" ON "users_locales" USING btree ("_locale" enum_ops,"_parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "users_location_location_country_idx" ON "users_locales" USING btree ("location_country_id" int4_ops);--> statement-breakpoint
CREATE INDEX "users_location_location_region_idx" ON "users_locales" USING btree ("location_region_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "team_logos_created_at_idx" ON "team_logos" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "team_logos_filename_idx" ON "team_logos" USING btree ("filename" text_ops);--> statement-breakpoint
CREATE INDEX "team_logos_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "team_logos" USING btree ("sizes_thumbnail_filename" text_ops);--> statement-breakpoint
CREATE INDEX "team_logos_updated_at_idx" ON "team_logos" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "match_idx" ON "predictions" USING btree ("match_id" text_ops);--> statement-breakpoint
CREATE INDEX "predictions_created_at_idx" ON "predictions" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "predictions_match_idx" ON "predictions" USING btree ("match_id" text_ops);--> statement-breakpoint
CREATE INDEX "predictions_updated_at_idx" ON "predictions" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "predictions_user_idx" ON "predictions" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "user_match_idx" ON "predictions" USING btree ("user_id" text_ops,"match_id" text_ops);--> statement-breakpoint
CREATE INDEX "notification_settings_created_at_idx" ON "notification_settings" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "notification_settings_updated_at_idx" ON "notification_settings" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "notification_settings_user_idx" ON "notification_settings" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id" text_ops);--> statement-breakpoint
CREATE INDEX "teams_league_tags_order_idx" ON "teams_league_tags" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "teams_league_tags_parent_idx" ON "teams_league_tags" USING btree ("parent_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "general_settings_locales_locale_parent_id_unique" ON "general_settings_locales" USING btree ("_locale" int4_ops,"_parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order" int4_ops);--> statement-breakpoint
CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "users_referral_data_referral_data_referral_code_idx" ON "users" USING btree ("referral_data_referral_code" text_ops);--> statement-breakpoint
CREATE INDEX "users_referral_data_referral_data_referred_by_idx" ON "users" USING btree ("referral_data_referred_by_id" text_ops);--> statement-breakpoint
CREATE INDEX "users_stats_stats_global_rank_idx" ON "users" USING btree ("stats_global_rank" numeric_ops);--> statement-breakpoint
CREATE INDEX "users_subscription_subscription_active_until_idx" ON "users" USING btree ("subscription_active_until" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username" text_ops);--> statement-breakpoint
CREATE INDEX "badges_created_at_idx" ON "badges" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "badges_icon_media_idx" ON "badges" USING btree ("icon_media_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "badges_slug_idx" ON "badges" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "badges_updated_at_idx" ON "badges" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "competitions_rels_membership_tiers_id_idx" ON "competitions_rels" USING btree ("membership_tiers_id" text_ops);--> statement-breakpoint
CREATE INDEX "competitions_rels_order_idx" ON "competitions_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "competitions_rels_parent_idx" ON "competitions_rels" USING btree ("parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "competitions_rels_path_idx" ON "competitions_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE INDEX "membership_tiers_created_at_idx" ON "membership_tiers" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "membership_tiers_updated_at_idx" ON "membership_tiers" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "countries_locales_locale_parent_id_unique" ON "countries_locales" USING btree ("_locale" int4_ops,"_parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country_id" int4_ops);--> statement-breakpoint
CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at" timestamptz_ops);
*/