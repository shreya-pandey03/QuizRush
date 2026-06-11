import { db } from "@/drizzle/src/db";
import { lobbyQuestions } from "@/drizzle/src/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const lobbyId = "test-lobby";


  const existing = await db
    .select()
    .from(lobbyQuestions)
    .where(eq(lobbyQuestions.lobbyId, lobbyId));

  if (existing.length > 0) {
    return NextResponse.json(existing);
  }

  
  const questions = [
    {
      question: "What is the capital of India?",
      optionA: "Mumbai",
      optionB: "Delhi",
      optionC: "Chennai",
      optionD: "Kolkata",
      answer: "optionB",
    },
  ];

  await db.insert(lobbyQuestions).values(
    questions.map((q, i) => ({
      lobbyId,
      questionNumber: i + 1,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      answer: q.answer,
    })),
  );

  return NextResponse.json(questions);
}
