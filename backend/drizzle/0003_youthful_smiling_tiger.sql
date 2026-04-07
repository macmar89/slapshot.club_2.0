CREATE TYPE "public"."announcement_type" AS ENUM('FEATURE', 'LEAGUE', 'IMPORTANT', 'MAINTENANCE', 'EVENT', 'BUGFIX', 'GENERAL');--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'MATCH_UPDATE';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'MATCH_EVALUATE';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'MATCH_REVERT_EVALUATION';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'MATCH_RECALCULATE';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'MATCH_VERIFY';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'ANNOUNCEMENT_CREATE';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'ANNOUNCEMENT_UPDATE';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'ANNOUNCEMENT_PUBLISH';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'ANNOUNCEMENT_UNPUBLISH';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'ANNOUNCEMENT_DELETE';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'NEW_ANNOUNCEMENT';--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "announcement_type" DEFAULT 'GENERAL' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "announcements_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "announcements_locales" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"parent_id" varchar(24) NOT NULL,
	"locale" "_locales" NOT NULL,
	"title" varchar(100) NOT NULL,
	"excerpt" varchar(500) NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "announcements_locales" ADD CONSTRAINT "announcements_locales_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "announcements_is_published_idx" ON "announcements" USING btree ("is_published");--> statement-breakpoint
CREATE UNIQUE INDEX "announcements_locales_locale_parent_id_unique" ON "announcements_locales" USING btree ("locale","parent_id");