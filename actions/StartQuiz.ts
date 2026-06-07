"use server";

import { db } from "@/drizzle/src/db";
import { questions } from "@/drizzle/src/db/schema";

export async function startQuiz(
  lobbyId: string,
  generatedQuestions: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    answer: string;
  }[]
) {
 await fetch("http://localhost:3001/api/lobby/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lobbyId }),
  });

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
    }))
  );
}