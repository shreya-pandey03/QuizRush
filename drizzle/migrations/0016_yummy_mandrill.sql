ALTER TABLE "lobbies" ALTER COLUMN "host_name" SET DEFAULT 'Unknown';--> statement-breakpoint
ALTER TABLE "game_history" ADD COLUMN "rank" integer;--> statement-breakpoint
ALTER TABLE "game_history" ADD COLUMN "is_winner" boolean DEFAULT false;