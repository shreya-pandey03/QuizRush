import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { questions } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const lobbyId = req.nextUrl.searchParams.get("lobbyId");

  if (!lobbyId) {
    return NextResponse.json(
      { error: "Missing lobbyId" },
      { status: 400 }
    );
  }

  const data = await db
    .select()
    .from(questions)
    .where(eq(questions.lobbyId, lobbyId));

  return NextResponse.json({
    questions: data,
  });
}