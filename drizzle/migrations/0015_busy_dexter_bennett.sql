ALTER TABLE "lobbies" ADD COLUMN "host_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ADD COLUMN "player_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ADD COLUMN "status" text DEFAULT 'waiting' NOT NULL;