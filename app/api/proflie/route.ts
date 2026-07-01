import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { userStats, gameHistory } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId" },
      { status: 400 }
    );
  }

  const stats = await db.query.userStats.findFirst({
    where: eq(userStats.userId, userId),
  });

  const history = await db
    .select()
    .from(gameHistory)
    .where(eq(gameHistory.userId, userId));

  const gamesPlayed = stats?.gamesPlayed ?? 0;
  const totalScore = stats?.totalScore ?? 0;

  const achievements = [
    gamesPlayed >= 1,
    totalScore >= 50,
    gamesPlayed >= 10,
    history.length >= 5,
  ].filter(Boolean).length;

  return NextResponse.json({
    stats: {
      gamesPlayed,
      totalScore,
      xp: stats?.xp ?? 0,
      level: stats?.level ?? 1,
      achievements,
    },
    historyCount: history.length,
  });
}