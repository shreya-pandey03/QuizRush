ALTER TABLE "user_stats" ALTER COLUMN "accuracy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ALTER COLUMN "win_rate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "wins" integer DEFAULT 0 NOT NULL;