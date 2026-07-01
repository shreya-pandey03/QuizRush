CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_code" text NOT NULL,
	"host_id" text NOT NULL,
	"status" text DEFAULT 'waiting',
	"started" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
