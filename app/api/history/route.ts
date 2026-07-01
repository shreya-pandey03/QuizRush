import { db } from "@/drizzle/src/db";
import { gameHistory } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json([]);
  }

  const history = await db
    .select()
    .from(gameHistory)
    .where(eq(gameHistory.userId, userId));

  return NextResponse.json(history);
}