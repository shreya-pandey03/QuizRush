import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { questions } from "@/drizzle/src/db/schema";
import { eq, asc } from "drizzle-orm";
import { gameStore } from "@/lib/socket/gameStore";

export async function GET(req: NextRequest) {
  const lobbyId = req.nextUrl.searchParams.get("lobbyId");

  if (!lobbyId) {
    return NextResponse.json(
      { error: "Missing lobbyId" },
      { status: 400 }
    );
  }

  //   PRIORITY: GAME STORE (LIVE STATE)
  const lobby = gameStore.get(lobbyId);

  if (lobby?.questions?.length) {
    return NextResponse.json({
      questions: lobby.questions,
      source: "memory",
    });
  }

  //   FALLBACK: DATABASE ONLY IF GAME NOT RUNNING
  
  const data = await db
    .select()
    .from(questions)
    .where(eq(questions.lobbyId, lobbyId))
    .orderBy(asc(questions.questionNumber));

console.log("DB COUNT:", data.length);
console.log(
  data.map((q) => q.questionNumber)
);


  return NextResponse.json({
    questions: data,
    source: "db",
  });
}