import { db } from "@/drizzle/src/db";
import { questions } from "@/drizzle/src/db/schema";
import { gameStore, resetLobby } from "@/lib/socket/gameStore";
import { eq } from "drizzle-orm";

export async function startQuiz(lobbyId: string, generatedQuestions: any[]) {
  //  CLEAN GAME STATE FIRST (MOST IMPORTANT FIX)
console.log("Generated Questions:", generatedQuestions.length);

resetLobby(lobbyId);

console.log(
  "Lobby after reset:",
  gameStore.get(lobbyId)
);

  //  CLEAN OLD QUESTIONS FROM DB
  await db.delete(questions).where(eq(questions.lobbyId, lobbyId));

  //  INSERT NEW QUESTIONS INTO DB
  await db.insert(questions).values(
    generatedQuestions.map((q, index) => ({
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

  //  UPDATE IN-MEMORY GAME STATE (SOURCE OF TRUTH)
  const lobby = gameStore.get(lobbyId);

  if (lobby) {
    lobby.questions = generatedQuestions;
    lobby.currentQuestionIndex = 0;
    lobby.status = "created"; // IMPORTANT: NOT playing yet
    lobby.started = false;
    lobby.timer = 0;
  }

  return {
    success: true,
    questionCount: generatedQuestions.length,
  };
}
