CREATE TABLE "game_history" (
	"id" text PRIMARY KEY NOT NULL,
	"lobby_id" text NOT NULL,
	"user_id" text NOT NULL,
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_results" (
	"id" text PRIMARY KEY NOT NULL,
	"lobby_id" text NOT NULL,
	"user_id" text NOT NULL,
	"score" integer NOT NULL,
	"accuracy" integer DEFAULT 0,
	"xp_gained" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"user_id" text PRIMARY KEY NOT NULL,
	"games_played" integer DEFAULT 0,
	"total_score" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"xp" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "lobbies" ADD COLUMN "session_id" text;