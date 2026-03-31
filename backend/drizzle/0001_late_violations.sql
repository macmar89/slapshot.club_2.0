CREATE TABLE "competition_standings" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"competition_id" varchar(24) NOT NULL,
	"team_id" varchar(24) NOT NULL,
	"group_name" varchar(50),
	"rank" integer NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"played" integer DEFAULT 0 NOT NULL,
	"win" integer DEFAULT 0 NOT NULL,
	"win_overtime" integer DEFAULT 0 NOT NULL,
	"lose" integer DEFAULT 0 NOT NULL,
	"lose_overtime" integer DEFAULT 0 NOT NULL,
	"goals_for" integer DEFAULT 0 NOT NULL,
	"goals_against" integer DEFAULT 0 NOT NULL,
	"form" varchar(5) DEFAULT '' NOT NULL,
	"phase" varchar(100) DEFAULT 'regular' NOT NULL,
	"series_score" varchar(10),
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competition_standings" ADD CONSTRAINT "competition_standings_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_standings" ADD CONSTRAINT "competition_standings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "competition_standings_competition_id_idx" ON "competition_standings" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "competition_standings_team_id_idx" ON "competition_standings" USING btree ("team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "competition_standings_competition_team_idx" ON "competition_standings" USING btree ("competition_id","team_id");