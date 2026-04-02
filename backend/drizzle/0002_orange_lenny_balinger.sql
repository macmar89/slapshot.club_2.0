CREATE TYPE "public"."enum_competitions_type" AS ENUM('regular', 'playoff');--> statement-breakpoint
ALTER TYPE "public"."enum_matches_stage_type" ADD VALUE 'relegation';--> statement-breakpoint
ALTER TYPE "public"."enum_matches_stage_type" ADD VALUE 'promotion';--> statement-breakpoint
CREATE TABLE "playoff_series" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"competition_id" varchar(24) NOT NULL,
	"team1_id" varchar(24) NOT NULL,
	"team2_id" varchar(24) NOT NULL,
	"score1" integer DEFAULT 0,
	"score2" integer DEFAULT 0,
	"stage" varchar(50),
	"is_finished" boolean DEFAULT false,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "phase" "enum_competitions_type" DEFAULT 'regular' NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "is_checked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "checked_at" timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "checked_by" varchar(24);--> statement-breakpoint
ALTER TABLE "playoff_series" ADD CONSTRAINT "playoff_series_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playoff_series" ADD CONSTRAINT "playoff_series_team1_id_fkey" FOREIGN KEY ("team1_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playoff_series" ADD CONSTRAINT "playoff_series_team2_id_fkey" FOREIGN KEY ("team2_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "playoff_series_competition_idx" ON "playoff_series" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "playoff_series_team1_idx" ON "playoff_series" USING btree ("team1_id");--> statement-breakpoint
CREATE INDEX "playoff_series_team2_idx" ON "playoff_series" USING btree ("team2_id");--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_checked_by_fkey" FOREIGN KEY ("checked_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "matches_checked_by_idx" ON "matches" USING btree ("checked_by");