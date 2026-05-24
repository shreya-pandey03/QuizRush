import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
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
  name: text("name").notNull(),
  hostId: uuid("hostId").notNull(),
  code: text("code").notNull().unique(),
  isStarted: boolean("isStarted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/* ================= LOBBY PLAYERS ================= */
export const lobbyPlayers = pgTable("lobbyPlayers", {
  id: uuid("id").defaultRandom().primaryKey(),
  lobbyId: uuid("lobbyId").notNull(),
  userId: uuid("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

/* ================= QUESTIONS ================= */
export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
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
  userId: uuid("userId").notNull(),
  lobbyId: uuid("lobbyId").notNull(),
  points: integer("points").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});