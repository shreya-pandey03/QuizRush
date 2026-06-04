import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  json,
} from "drizzle-orm/pg-core";


/* ================= USERS ================= */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/* ================= LOBBIES ================= */
export const lobbies = pgTable("lobbies", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name"),

  hostId: text("hostId"),

  code: text("code").unique(),

  isStarted: boolean("isStarted").default(false),

  createdAt: timestamp("createdAt").defaultNow(),
});

/* ================= LOBBY PLAYERS ================= */
export const lobbyPlayers = pgTable("lobby_players", {
  id: uuid("id").defaultRandom().primaryKey(),

  lobbyId: uuid("lobby_id").notNull(),

  userId: text("user_id").notNull(),

  joinedAt: timestamp("joined_at").defaultNow(),
});

/* ================= QUESTIONS ================= */
export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),

  lobbyId: uuid("lobby_id").notNull(),

  questionNumber: integer("question_number").notNull(),

  question: text("question").notNull(),

  optionA: text("optionA").notNull(),
  optionB: text("optionB").notNull(),
  optionC: text("optionC").notNull(),
  optionD: text("optionD").notNull(),

  answer: text("answer").notNull(),
});

/* ================= SCORES ================= */
export const scores = pgTable("scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("userId").notNull(),
  lobbyId: uuid("lobbyId").notNull(),
  points: integer("points").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const quizProgress = pgTable("quiz_progress", {
  id: uuid("id").defaultRandom().primaryKey(),

  lobbyId: uuid("lobby_id").notNull(),

  userId: text("user_id").notNull(),

  currentQuestion: integer("current_question").default(0),

  answers: json("answers").$type<string[]>().default([]),

  score: integer("score").default(0),

  quizEnded: boolean("quiz_ended").default(false),

  updatedAt: timestamp("updated_at").defaultNow(),
});

