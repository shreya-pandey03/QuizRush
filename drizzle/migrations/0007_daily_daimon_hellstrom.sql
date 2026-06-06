CREATE TABLE "lobby_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lobby_id" text NOT NULL,
	"question_number" integer NOT NULL,
	"question" text NOT NULL,
	"optionA" text NOT NULL,
	"optionB" text NOT NULL,
	"optionC" text NOT NULL,
	"optionD" text NOT NULL,
	"answer" text NOT NULL
);
