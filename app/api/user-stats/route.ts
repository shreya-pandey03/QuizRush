import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { userStats, gameHistory } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 },
      );
    }

    const stats = await db.query.userStats.findFirst({
      where: eq(userStats.userId, userId),
    });

    const history = await db
      .select()
      .from(gameHistory)
      .where(eq(gameHistory.userId, userId));

    return NextResponse.json({
      gamesPlayed: stats?.gamesPlayed ?? 0,
      totalScore: stats?.totalScore ?? 0,
      accuracy: stats?.accuracy ?? 0,
      winRate: stats?.winRate ?? 0,
      xp: stats?.xp ?? 0,
      level: stats?.level ?? 1,
      wins: stats?.wins ?? 0,
      historyCount: history.length,
    });
  } catch (error) {
    console.error("USER STATS API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}