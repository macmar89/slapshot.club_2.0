CREATE TYPE "public"."audit_action" AS ENUM('LOGIN_SUCCESS', 'LOGIN_FAILED', 'REGISTER_SUCCESS', 'LOGOUT', 'PASSWORD_CHANGE', 'PREDICTIONS_UPDATE', 'SUB_PLAN_CHANGE', 'COMP_JOIN', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'COMP_LEAVE', 'CREDIT_REFUND', 'EMAIL_VERIFIED', 'USERNAME_CHANGE', 'EMAIL_CHANGE_REQUEST', 'GROUP_CREATE', 'GROUP_DELETE', 'GROUP_JOIN', 'GROUP_LEAVE', 'GROUP_INVITE', 'GROUP_REQUEST', 'GROUP_KICK', 'GROUP_ROLE_CHANGE', 'GROUP_STATUS_CHANGE', 'GROUP_OWNERSHIP_TRANSFER', 'GROUP_ALIAS_CHANGE', 'GROUP_SETTINGS_CHANGE');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('user', 'subscription', 'competition', 'auth', 'prediction', 'group', 'match', 'team', 'leaderboard');--> statement-breakpoint
CREATE TYPE "public"."enum_competitions_status" AS ENUM('upcoming', 'active', 'finished', 'archived');--> statement-breakpoint
CREATE TYPE "public"."enum_feedback_status" AS ENUM('new', 'in-progress', 'resolved', 'ignored');--> statement-breakpoint
CREATE TYPE "public"."enum_feedback_type" AS ENUM('bug', 'idea', 'change_user_email_request', 'custom_country_request', 'other');--> statement-breakpoint
CREATE TYPE "public"."enum_group_member_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."enum_group_member_status" AS ENUM('pending', 'invited', 'active', 'rejected', 'banned');--> statement-breakpoint
CREATE TYPE "public"."enum_group_status" AS ENUM('active', 'warning', 'locked');--> statement-breakpoint
CREATE TYPE "public"."enum_group_type" AS ENUM('private', 'vip', 'business', 'pub', 'partner');--> statement-breakpoint
CREATE TYPE "public"."_locales" AS ENUM('sk', 'en', 'cs');--> statement-breakpoint
CREATE TYPE "public"."enum_matches_result_ending_type" AS ENUM('regular', 'ot', 'so');--> statement-breakpoint
CREATE TYPE "public"."enum_matches_stage_type" AS ENUM('regular_season', 'group_phase', 'playoffs', 'pre_season');--> statement-breakpoint
CREATE TYPE "public"."enum_matches_status" AS ENUM('scheduled', 'live', 'finished', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."enum_predictions_status" AS ENUM('pending', 'evaluated', 'void');--> statement-breakpoint
CREATE TYPE "public"."enum_teams_type" AS ENUM('club', 'national');--> statement-breakpoint
CREATE TYPE "public"."enum_users_preferred_language" AS ENUM('sk', 'en', 'cs');--> statement-breakpoint
CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'user', 'demo');--> statement-breakpoint
CREATE TYPE "public"."enum_users_subscription_plan" AS ENUM('free', 'starter', 'pro', 'vip');--> statement-breakpoint
CREATE TYPE "public"."enum_users_subscription_plan_type" AS ENUM('seasonal', 'lifetime');--> statement-breakpoint
CREATE TYPE "public"."enum_subscription_status" AS ENUM('active', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('MATCH_FINISHED', 'POINTS_AWARDED', 'GROUP_INVITE', 'GROUP_INVITE_ACCEPTED', 'GROUP_INVITE_REJECTED', 'GROUP_PENDING', 'GROUP_PENDING_ACCEPTED', 'GROUP_PENDING_REJECTED', 'MATCH_REMINDER', 'DAILY_TIPS_REMINDER', 'TRIAL_EXPIRING', 'NEW_COMPETITION', 'COMPETITION_FINISHED', 'COMPETITION_STARTED', 'SYSTEM_ALERT', 'NEW_FEATURE', 'UPDATE_SUMMARY');--> statement-breakpoint
CREATE SEQUENCE "public"."rate_limits_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "assets" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"url" text NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime_type" varchar(100),
	"filesize" integer,
	"width" integer,
	"height" integer,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24),
	"action" "audit_action" NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" varchar(255),
	"metadata" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"sport" varchar DEFAULT 'HOCKEY' NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"token" varchar(255) NOT NULL,
	"user_agent" varchar(255),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"season_year" integer NOT NULL,
	"credit_cost" integer DEFAULT 0 NOT NULL,
	"status" "enum_competitions_status" DEFAULT 'upcoming' NOT NULL,
	"is_registration_open" boolean DEFAULT false,
	"start_date" timestamp(3) with time zone NOT NULL,
	"end_date" timestamp(3) with time zone NOT NULL,
	"total_participants" integer DEFAULT 0,
	"total_played_matches" integer DEFAULT 0,
	"total_possible_points" integer DEFAULT 0,
	"recalculation_hour" integer DEFAULT 5,
	"api_hockey_id" varchar,
	"api_hockey_season" integer,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitions_locales" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"competition_id" varchar(24) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"locale" "_locales" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competition_snapshots" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"competition_id" varchar(24) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"rank" integer NOT NULL,
	"ovr" integer NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"exact_guesses" integer DEFAULT 0,
	"winner_diff" integer DEFAULT 0,
	"winner" integer DEFAULT 0,
	"adjacent" integer DEFAULT 0,
	"total_tips" integer DEFAULT 0,
	"date" timestamp(3) with time zone NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"type" "enum_feedback_type" DEFAULT 'idea' NOT NULL,
	"message" varchar NOT NULL,
	"page_url" varchar(255),
	"user_id" varchar(24),
	"read" boolean DEFAULT false NOT NULL,
	"status" "enum_feedback_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "general_settings" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"seo_image_id" varchar(24),
	"cron_settings_update_matches_enabled" boolean DEFAULT true,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "general_settings_locales" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"parent_id" varchar(24) NOT NULL,
	"locale" "_locales" NOT NULL,
	"gdpr_content" text NOT NULL,
	"seo_title" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"group_id" varchar(24) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"role" "enum_group_member_role" DEFAULT 'member',
	"alias" varchar(100),
	"status" "enum_group_member_status" DEFAULT 'active' NOT NULL,
	"joined_at" timestamp(3) with time zone DEFAULT now(),
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" "enum_group_type" DEFAULT 'private' NOT NULL,
	"status" "enum_group_status" DEFAULT 'active' NOT NULL,
	"warning_expires_at" timestamp(3) with time zone,
	"code" varchar(20),
	"owner_id" varchar(24) NOT NULL,
	"competition_id" varchar(24) NOT NULL,
	"credit_cost" integer DEFAULT 0 NOT NULL,
	"max_members" integer DEFAULT 5 NOT NULL,
	"absolute_max_capacity" integer DEFAULT 30 NOT NULL,
	"stats_members_count" integer DEFAULT 0 NOT NULL,
	"stats_pending_members_count" integer DEFAULT 0 NOT NULL,
	"is_alias_required" boolean DEFAULT false NOT NULL,
	"origin_group_id" varchar(24),
	"settings" jsonb DEFAULT '{"isLocked":false,"allowMemberInvites":true,"requireApproval":true}'::jsonb NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"competition_id" varchar NOT NULL,
	"season_year" integer NOT NULL,
	"total_points" integer DEFAULT 0,
	"total_predictions" integer DEFAULT 0,
	"exact_guesses" integer DEFAULT 0,
	"correct_trends" integer DEFAULT 0,
	"correct_diffs" integer DEFAULT 0,
	"wrong_guesses" integer DEFAULT 0,
	"current_form" varchar(5) DEFAULT '',
	"current_rank" integer DEFAULT 0,
	"previous_rank" integer DEFAULT 0,
	"rank_change" integer DEFAULT 0,
	"active_league_id" varchar,
	"ovr" integer DEFAULT 0,
	"statsOwnedPrivateGroups" integer DEFAULT 0 NOT NULL,
	"statsJoinedPrivateGroups" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "current_form_check" CHECK ("leaderboard_entries"."current_form" ~ '^[ESWL]*$')
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"display_title" varchar(255),
	"competition_id" varchar(24) NOT NULL,
	"home_team_id" varchar(24) NOT NULL,
	"away_team_id" varchar(24) NOT NULL,
	"date" timestamp(3) with time zone NOT NULL,
	"status" "enum_matches_status" DEFAULT 'scheduled' NOT NULL,
	"home_predicted_count" integer DEFAULT 0 NOT NULL,
	"away_predicted_count" integer DEFAULT 0 NOT NULL,
	"stage_type" "enum_matches_stage_type" DEFAULT 'regular_season' NOT NULL,
	"result_home_score" integer DEFAULT 0,
	"result_away_score" integer DEFAULT 0,
	"result_ending_type" "enum_matches_result_ending_type" DEFAULT 'regular',
	"round_label" varchar(100),
	"round_order" integer,
	"group_name" varchar(50),
	"series_game_number" integer,
	"series_state" varchar(100),
	"ranked_at" timestamp(3) with time zone,
	"api_hockey_id" varchar(50),
	"api_hockey_status" varchar(10),
	"prediction_stats" jsonb DEFAULT '{"scores":{}}'::jsonb,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "predictions" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"match_id" varchar(24) NOT NULL,
	"competition_id" varchar(24) NOT NULL,
	"home_goals" integer NOT NULL,
	"away_goals" integer NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"status" "enum_predictions_status" DEFAULT 'pending' NOT NULL,
	"evaluated_at" timestamp(3) with time zone,
	"is_exact" boolean DEFAULT false NOT NULL,
	"is_trend" boolean DEFAULT false NOT NULL,
	"is_diff" boolean DEFAULT false NOT NULL,
	"is_wrong" boolean DEFAULT false NOT NULL,
	"edit_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
CREATE TABLE "teams" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" "enum_teams_type" DEFAULT 'club' NOT NULL,
	"logo_id" varchar(24),
	"colors_primary" varchar(7) DEFAULT '#000000' NOT NULL,
	"colors_secondary" varchar(7) DEFAULT '#ffffff' NOT NULL,
	"api_hockey_id" varchar,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams_locales" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"parent_id" varchar(24) NOT NULL,
	"locale" "_locales" NOT NULL,
	"name" varchar(100) NOT NULL,
	"short_name" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "enum_users_role" DEFAULT 'user' NOT NULL,
	"last_active_at" timestamp(3) with time zone,
	"preferred_language" "enum_users_preferred_language" DEFAULT 'sk',
	"subscription_plan" "enum_users_subscription_plan" DEFAULT 'free' NOT NULL,
	"subscription_active_until" timestamp(3) with time zone,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"verified_at" timestamp(3) with time zone,
	"verification_token" varchar,
	"is_active" boolean DEFAULT true NOT NULL,
	"referral_code" varchar NOT NULL,
	"referred_by_id" varchar(24),
	"total_registered" integer DEFAULT 0,
	"total_paid" integer DEFAULT 0,
	"has_seen_onboarding" boolean DEFAULT false,
	"notification_settings" jsonb DEFAULT '{"matchFinished":{"inApp":true,"push":true},"pointsAwarded":{"inApp":true,"push":true},"groupInvites":{"inApp":true,"push":true},"marketingNews":{"inApp":true,"push":false}}'::jsonb,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "user_referrals" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"referrer_id" varchar(24) NOT NULL,
	"referred_user_id" varchar(24) NOT NULL,
	"has_converted_to_pro" boolean DEFAULT false NOT NULL,
	"converted_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"gdpr_consent" boolean DEFAULT false NOT NULL,
	"marketing_consent" boolean DEFAULT false,
	"marketing_consent_date" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"lifetime_points" integer DEFAULT 0 NOT NULL,
	"lifetime_possible_points" integer DEFAULT 0 NOT NULL,
	"total_predictions" integer DEFAULT 0 NOT NULL,
	"life_time_exact_guesses" integer DEFAULT 0,
	"life_time_correct_trends" integer DEFAULT 0,
	"life_time_correct_diffs" integer DEFAULT 0,
	"life_time_wrong_guesses" integer DEFAULT 0,
	"current_ovr" integer DEFAULT 0 NOT NULL,
	"max_ovr_ever" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"plan" "enum_users_subscription_plan" DEFAULT 'free' NOT NULL,
	"plan_type" "enum_users_subscription_plan_type" DEFAULT 'seasonal' NOT NULL,
	"status" "enum_subscription_status" DEFAULT 'active' NOT NULL,
	"active_from" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"active_until" timestamp(3) with time zone NOT NULL,
	"payment_id" text,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24),
	"type" "notification_type" NOT NULL,
	"title_key" text NOT NULL,
	"message_key" text NOT NULL,
	"payload" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions_locales" ADD CONSTRAINT "competitions_locales__parent_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_snapshots" ADD CONSTRAINT "competition_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_snapshots" ADD CONSTRAINT "competition_snapshots_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_settings" ADD CONSTRAINT "general_settings_seo_image_id_fkey" FOREIGN KEY ("seo_image_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_settings_locales" ADD CONSTRAINT "general_settings_locales_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."general_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_origin_group_id_groups_id_fk" FOREIGN KEY ("origin_group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_active_league_id_fkey" FOREIGN KEY ("active_league_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_locales" ADD CONSTRAINT "teams_locales_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_referred_by_id_users_id_fk" FOREIGN KEY ("referred_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "assets_key_idx" ON "assets" USING btree ("key");--> statement-breakpoint
CREATE INDEX "assets_created_at_idx" ON "assets" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "refresh_tokens_token_unique_idx" ON "refresh_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "user_device_idx" ON "refresh_tokens" USING btree ("user_id","user_agent");--> statement-breakpoint
CREATE INDEX "competitions_sort_order_idx" ON "competitions" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "competitions_slug_idx" ON "competitions" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "competitions_locales_locale_comp_id_unique" ON "competitions_locales" USING btree ("locale","competition_id");--> statement-breakpoint
CREATE INDEX "user_comp_date_idx" ON "competition_snapshots" USING btree ("user_id","competition_id","date");--> statement-breakpoint
CREATE INDEX "competition_date_idx" ON "competition_snapshots" USING btree ("competition_id","date");--> statement-breakpoint
CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "feedback_user_idx" ON "feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "feedback_status_idx" ON "feedback" USING btree ("status");--> statement-breakpoint
CREATE INDEX "general_settings_seo_image_idx" ON "general_settings" USING btree ("seo_image_id");--> statement-breakpoint
CREATE UNIQUE INDEX "general_settings_locales_locale_parent_id_unique" ON "general_settings_locales" USING btree ("locale","parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "group_user_unique_idx" ON "group_members" USING btree ("group_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "groups_code_idx" ON "groups" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "groups_slug_idx" ON "groups" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "groups_competition_idx" ON "groups" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "groups_owner_idx" ON "groups" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "leaderboard_user_competition_season_idx" ON "leaderboard_entries" USING btree ("user_id","competition_id","season_year");--> statement-breakpoint
CREATE INDEX "leaderboard_competition_points_idx" ON "leaderboard_entries" USING btree ("competition_id","total_points");--> statement-breakpoint
CREATE INDEX "leaderboard_user_idx" ON "leaderboard_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "leaderboard_current_rank_idx" ON "leaderboard_entries" USING btree ("current_rank");--> statement-breakpoint
CREATE INDEX "leaderboard_active_league_idx" ON "leaderboard_entries" USING btree ("active_league_id");--> statement-breakpoint
CREATE INDEX "matches_competition_idx" ON "matches" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "matches_date_idx" ON "matches" USING btree ("date");--> statement-breakpoint
CREATE INDEX "matches_home_team_idx" ON "matches" USING btree ("home_team_id");--> statement-breakpoint
CREATE INDEX "matches_away_team_idx" ON "matches" USING btree ("away_team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_match_idx" ON "predictions" USING btree ("user_id","match_id");--> statement-breakpoint
CREATE INDEX "predictions_match_idx" ON "predictions" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "predictions_user_idx" ON "predictions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "predictions_competition_idx" ON "predictions" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "rate_limits_created_at_idx" ON "rate_limits" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "rate_limits_ip_idx" ON "rate_limits" USING btree ("ip" text_ops);--> statement-breakpoint
CREATE INDEX "rate_limits_updated_at_idx" ON "rate_limits" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "teams_slug_idx" ON "teams" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "teams_logo_idx" ON "teams" USING btree ("logo_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teams_locales_locale_parent_id_unique" ON "teams_locales" USING btree ("locale","parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_referral_code_idx" ON "users" USING btree ("referral_code");--> statement-breakpoint
CREATE INDEX "users_subscription_active_until_idx" ON "users" USING btree ("subscription_active_until");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "users_referred_by_idx" ON "users" USING btree ("referred_by_id");--> statement-breakpoint
CREATE INDEX "user_referrals_referrer_idx" ON "user_referrals" USING btree ("referrer_id");--> statement-breakpoint
CREATE INDEX "user_referrals_referred_user_idx" ON "user_referrals" USING btree ("referred_user_id");--> statement-breakpoint
CREATE INDEX "user_referrals_referrer_pro_idx" ON "user_referrals" USING btree ("referrer_id","has_converted_to_pro");--> statement-breakpoint
CREATE UNIQUE INDEX "user_stats_user_id_unique" ON "user_stats" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "user_stats_user_id_idx" ON "user_stats" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_active_until_idx" ON "subscriptions" USING btree ("active_until");