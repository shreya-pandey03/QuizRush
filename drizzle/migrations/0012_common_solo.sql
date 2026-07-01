CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"badge" text NOT NULL,
	"unlocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "accuracy" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "win_rate" integer DEFAULT 0;