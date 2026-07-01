import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  json,
} from "drizzle-orm/pg-core";

/* USERS  */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/*  LOBBIES  */
export const lobbies = pgTable("lobbies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  hostId: text("hostId"),
  hostName: text("host_name").notNull().default("Unknown"),
  playerCount: integer("player_count").default(1).notNull(),
  status: text("status").default("waiting").notNull(),
  code: text("code").unique(),
  category: text("category"),
  difficulty: text("difficulty"),
  isStarted: boolean("isStarted").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  sessionId: text("session_id"),
});

/*  LOBBY PLAYERS  */
export const lobbyPlayers = pgTable("lobby_players", {
  id: uuid("id").defaultRandom().primaryKey(),
  lobbyId: uuid("lobby_id").notNull(),
  userId: text("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// export const questions = pgTable("questions", {
//   id: uuid("id").defaultRandom().primaryKey(),

// lobbyId: text("lobby_id").notNull(),

//   questionNumber: integer("question_number").notNull(),

//   question: text("question").notNull(),

//   optionA: text("optionA").notNull(),
//   optionB: text("optionB").notNull(),
//   optionC: text("optionC").notNull(),
//   optionD: text("optionD").notNull(),

//   answer: text("answer").notNull(),
// });

/*  SCORES */
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

//Questions
export const lobbyQuestions = pgTable("lobby_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  lobbyId: text("lobby_id").notNull(),
  questionNumber: integer("question_number").notNull(),
  question: text("question").notNull(),
  optionA: text("optionA").notNull(),
  optionB: text("optionB").notNull(),
  optionC: text("optionC").notNull(),
  optionD: text("optionD").notNull(),
  answer: text("answer").notNull(),
});

export const gameResults = pgTable("game_results", {
  id: text("id").primaryKey(),
  lobbyId: text("lobby_id").notNull(),
  userId: text("user_id").notNull(),
  score: integer("score").notNull(),
  accuracy: integer("accuracy").default(0),
  xpGained: integer("xp_gained").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  userId: text("user_id").primaryKey(),
  gamesPlayed: integer("games_played").default(0).notNull(),
  totalScore: integer("total_score").default(0).notNull(),
  accuracy: integer("accuracy").default(0).notNull(),
  wins: integer("wins").default(0).notNull(),
  winRate: integer("win_rate").default(0).notNull(),
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
});

export const gameHistory = pgTable("game_history", {
  id: text("id").primaryKey(),
  lobbyId: text("lobby_id").notNull(),
  userId: text("user_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  rank: integer("rank"),
  isWinner: boolean("is_winner").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  badge: text("badge").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});
