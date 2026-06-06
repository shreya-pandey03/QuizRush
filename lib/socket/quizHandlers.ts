import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";
import { startTimer } from "./timers";
import { generateQuestions } from "@/lib/ai/generateQuestions";
import { db } from "@/drizzle/src/db";
import { questions } from "@/drizzle/src/db/schema";

export function quizHandlers(io: Server, socket: Socket) {
socket.on("start-quiz", async ({ lobbyId }) => {
  console.log("START QUIZ RECEIVED:", lobbyId);

  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  console.log("LOBBY FOUND:", !!lobby);

  // prevent double start
  if (lobby.started) {
    io.to(lobbyId).emit("quiz-started", lobby.questions);
    return;
  }

  if (!lobby.questions || lobby.questions.length === 0) {
    const seed = Date.now() + Math.random();

    const generatedQuestions = await generateQuestions(
      lobby.category,
      lobby.difficulty,
      10,
      seed
    );

    lobby.questions = generatedQuestions;

    await db.insert(questions).values(
      generatedQuestions.map((q: { question: any; options: any[]; answer: any; }, index: number) => ({
        lobbyId,
        questionNumber: index + 1,
        question: q.question,
        optionA: q.options[0],
        optionB: q.options[1],
        optionC: q.options[2],
        optionD: q.options[3],
        answer: q.answer,
      }))
    );
  }

  lobby.started = true;

  io.to(lobbyId).emit("quiz-started", lobby.questions);

  startTimer(io, lobbyId);
});
}
