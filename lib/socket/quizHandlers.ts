import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";
import { startTimer } from "./timers";
import { generateQuestions } from "@/lib/ai/generateQuestions";
import { db } from "@/drizzle/src/db";
import { questions } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export function quizHandlers(io: Server, socket: Socket) {
  socket.on("start-quiz", async ({ lobbyId }) => {
    console.log("START QUIZ RECEIVED:", lobbyId);

    const lobby = gameStore.get(lobbyId);
    if (!lobby) return;

    console.log("LOBBY FOUND:", !!lobby);

    //  RESET STATE EVERY TIME QUIZ STARTS
    lobby.started = false;
    lobby.answers = {};
    lobby.scores = {};

    // prevent double start
    if (lobby.started) {
      io.to(lobbyId).emit("quiz-started", lobby.questions);
      return;
    }

    // generate only once
    if (!lobby.questions || lobby.questions.length === 0) {
      const seed = Date.now() + Math.random();

      const generatedQuestions = await generateQuestions(
        String(lobby.category),
        String(lobby.difficulty),
        10,
        seed,
      );

      lobby.questions = generatedQuestions.map((q) => ({
        id: crypto.randomUUID(),

        question: q.question,

        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,

        answer: q.answer,
      }));

      // save to DB

      await db.delete(questions).where(eq(questions.lobbyId, lobbyId));

      await db.delete(questions).where(eq(questions.lobbyId, lobbyId));

      await db.insert(questions).values(
        lobby.questions.map((q, index) => ({
          lobbyId,
          questionNumber: index + 1,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          answer: q.answer,
        })),
      );
    }

    lobby.started = true;

    io.to(lobbyId).emit("quiz-started", lobby.questions);

    startTimer(io, lobbyId);
  });
}
