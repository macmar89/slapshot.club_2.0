ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "is_sync_enabled" boolean DEFAULT false;
