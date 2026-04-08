ALTER TYPE "public"."entity_type" ADD VALUE 'announcement';--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "published_at" SET DATA TYPE timestamp(3) with time zone;