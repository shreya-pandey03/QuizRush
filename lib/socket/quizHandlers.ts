import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";
import { startTimer } from "./timers";
import { generateQuestions } from "@/lib/ai/generateQuestions";
import { db } from "@/drizzle/src/db";
import { questions } from "@/drizzle/src/db/schema";

export function quizHandlers(io: Server, socket: Socket) {
  socket.on("start-quiz", async ({ lobbyId }) => {
    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    if (lobby.questions.length === 0) {
      const generatedQuestions = await generateQuestions(
        "Science",
        "Medium",
        10,
      );

      lobby.questions = generatedQuestions;

console.log(generatedQuestions);

      await db.insert(questions).values(
        generatedQuestions.map(
          (q: { question: any; options: any[]; answer: any }) => ({
            question: q.question,
            optionA: q.options[0],
            optionB: q.options[1],
            optionC: q.options[2],
            optionD: q.options[3],
            answer: q.answer,
          }),
        ),
      );
    }

    lobby.started = true;

    const firstQuestion = lobby.questions[0];

io.to(lobbyId).emit(
  "quiz-started",
  {
    question: firstQuestion.question,
    options: firstQuestion.options,
  }
);

    startTimer(io, lobbyId);
  });
}
