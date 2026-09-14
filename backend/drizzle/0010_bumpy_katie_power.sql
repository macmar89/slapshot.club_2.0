CREATE TYPE "public"."monthly_period_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TABLE "monthly_leaderboard_entries" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"competition_id" varchar NOT NULL,
	"period_year" integer NOT NULL,
	"period_month" integer NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"total_predictions" integer DEFAULT 0 NOT NULL,
	"exact_guesses" integer DEFAULT 0 NOT NULL,
	"correct_trends" integer DEFAULT 0 NOT NULL,
	"correct_diffs" integer DEFAULT 0 NOT NULL,
	"wrong_guesses" integer DEFAULT 0 NOT NULL,
	"current_rank" integer DEFAULT 0 NOT NULL,
	"previous_rank" integer DEFAULT 0 NOT NULL,
	"rank_change" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "monthly_leaderboard_period_month_check" CHECK ("monthly_leaderboard_entries"."period_month" between 1 and 12)
);
--> statement-breakpoint
CREATE TABLE "monthly_leaderboard_periods" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"competition_id" varchar NOT NULL,
	"period_year" integer NOT NULL,
	"period_month" integer NOT NULL,
	"status" "monthly_period_status" DEFAULT 'open' NOT NULL,
	"total_participants" integer DEFAULT 0 NOT NULL,
	"total_played_matches" integer DEFAULT 0 NOT NULL,
	"total_possible_points" integer DEFAULT 0 NOT NULL,
	"winner_user_id" varchar,
	"last_recalculated_at" timestamp(3) with time zone,
	"closed_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "monthly_leaderboard_entries" ADD CONSTRAINT "monthly_leaderboard_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_leaderboard_entries" ADD CONSTRAINT "monthly_leaderboard_entries_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_leaderboard_periods" ADD CONSTRAINT "monthly_leaderboard_periods_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_leaderboard_periods" ADD CONSTRAINT "monthly_leaderboard_periods_winner_user_id_fkey" FOREIGN KEY ("winner_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "monthly_leaderboard_user_competition_period_idx" ON "monthly_leaderboard_entries" USING btree ("user_id","competition_id","period_year","period_month");--> statement-breakpoint
CREATE INDEX "monthly_leaderboard_period_points_idx" ON "monthly_leaderboard_entries" USING btree ("competition_id","period_year","period_month","total_points");--> statement-breakpoint
CREATE INDEX "monthly_leaderboard_user_idx" ON "monthly_leaderboard_entries" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "monthly_period_competition_period_idx" ON "monthly_leaderboard_periods" USING btree ("competition_id","period_year","period_month");--> statement-breakpoint
CREATE INDEX "monthly_period_status_idx" ON "monthly_leaderboard_periods" USING btree ("status");--> statement-breakpoint
CREATE INDEX "matches_competition_date_idx" ON "matches" USING btree ("competition_id","date");