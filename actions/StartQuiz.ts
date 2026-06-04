"use server";

import { db } from "@/drizzle/src/db";
import { questions } from "@/drizzle/src/db/schema";

export async function startQuiz(
  lobbyId: string,
  generatedQuestions: {
    question: string;
    options: string[];
    answer: string;
  }[],
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

      optionA: q.options[0],
      optionB: q.options[1],
      optionC: q.options[2],
      optionD: q.options[3],

      answer: q.answer,
    })),
  );
}
