ALTER TABLE "lobbies" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "hostId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "hostId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "isStarted" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "createdAt" DROP NOT NULL;