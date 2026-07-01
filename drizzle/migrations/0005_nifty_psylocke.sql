CREATE TABLE "quiz_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lobby_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"current_question" integer DEFAULT 0,
	"answers" json DEFAULT '[]'::json,
	"score" integer DEFAULT 0,
	"quiz_ended" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "scores" ALTER COLUMN "userId" SET DATA TYPE text;