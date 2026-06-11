import { Server } from "socket.io";
import { timers } from "./timers";
import { gameStore } from "@/lib/socket/gameStore";
import { db } from "@/drizzle/src/db";
import { lobbyQuestions } from "@/drizzle/src/db/schema";
import { eq, asc } from "drizzle-orm";

type Player = {
  id: string;
  name: string;
  score: number;
  answered: boolean;
};

type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
};

type Lobby = {
  id: string;
  started: boolean;
  status: "created" | "waiting" | "playing" | "finished";
  currentQuestionIndex: number;
  timer: number;
  questions: Question[];
  players: Player[];
};

export async function startGame(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  if (lobby.status === "playing") return;

  //  ALWAYS LOAD FROM DB
  const questions = await db
    .select()
    .from(lobbyQuestions)
    .where(eq(lobbyQuestions.lobbyId, lobbyId))
    .orderBy(asc(lobbyQuestions.questionNumber));

  // if (!questions.length) {
  //   console.log("NO QUESTIONS IN DB FOR LOBBY:", lobbyId);
  //   return;
  // }

  // sync into memory
  lobby.questions = questions;

  lobby.started = true;
  lobby.status = "playing";
  lobby.currentQuestionIndex = 0;

  sendQuestion(io, lobbyId);
  startTimer(io, lobbyId);
}

export function sendQuestion(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId) as Lobby | undefined;

  if (!lobby) return;

  const question = lobby.questions[lobby.currentQuestionIndex];

  if (!question) return;

  io.to(lobbyId).emit("new-question", {
    question: {
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      answer: question.answer, // optional (can remove later for security)
    },
  });
}

export function startTimer(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId) as Lobby | undefined;

  if (!lobby) return;

  // clear old timer safely
  const oldTimer = timers.get(lobbyId);
  if (oldTimer) {
    clearInterval(oldTimer);
    timers.delete(lobbyId);
  }

  lobby.timer = 15;

  const interval = setInterval(() => {
    const currentLobby = gameStore.get(lobbyId) as Lobby | undefined;

    if (!currentLobby || currentLobby.status !== "playing") {
      clearInterval(interval);
      timers.delete(lobbyId);
      return;
    }

    currentLobby.timer--;

    io.to(lobbyId).emit("timer-update", {
      timeLeft: currentLobby.timer,
    });

    if (currentLobby.timer <= 0) {
      clearInterval(interval);
      timers.delete(lobbyId);

      nextQuestion(io, lobbyId);
    }
  }, 1000);

  timers.set(lobbyId, interval);
}

export function nextQuestion(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId) as Lobby | undefined;

  if (!lobby) return;

  lobby.currentQuestionIndex++;

  //  END GAME
  if (lobby.currentQuestionIndex >= lobby.questions.length) {
    lobby.status = "finished";

    io.to(lobbyId).emit("quiz-ended", {
      leaderboard: [...lobby.players].sort((a, b) => b.score - a.score),
    });

    return;
  }

  // reset player state
  lobby.players.forEach((p) => {
    p.answered = false;
  });

  sendQuestion(io, lobbyId);
  startTimer(io, lobbyId);
}

export function resetGame(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId) as Lobby | undefined;

  if (!lobby) return;

  const oldTimer = timers.get(lobbyId);
  if (oldTimer) {
    clearInterval(oldTimer);
    timers.delete(lobbyId);
  }

  lobby.started = false;
  lobby.status = "created";
  lobby.currentQuestionIndex = 0;
  lobby.timer = 0;
  lobby.questions = [];

  lobby.players.forEach((p) => {
    p.score = 0;
    p.answered = false;
  });

  io.to(lobbyId).emit("quiz-reset");
}
