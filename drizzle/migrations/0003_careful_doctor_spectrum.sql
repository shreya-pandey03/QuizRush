CREATE TABLE "lobby_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lobby_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "hostId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "hostId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "isStarted" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "question" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "optionA" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "optionB" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "optionC" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "optionD" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "answer" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "scores" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ALTER COLUMN "points" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "lobbyId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ADD CONSTRAINT "lobbies_code_unique" UNIQUE("code");