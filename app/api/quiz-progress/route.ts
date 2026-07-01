import { NextResponse } from "next/server";

let progressStore: any[] = [];

// GET progress
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lobbyId = searchParams.get("lobbyId");
  const userId = searchParams.get("userId");

  const progress = progressStore.find(
    (p) => p.lobbyId === lobbyId && p.userId === userId,
  );

  return NextResponse.json(progress || {});
}

// SAVE progress
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { lobbyId, userId, currentQuestion, score } = body;

    const existing = progressStore.find(
      (p) => p.lobbyId === lobbyId && p.userId === userId,
    );

    if (existing) {
      existing.currentQuestion = currentQuestion;
      existing.score = score;
    } else {
      progressStore.push({
        lobbyId,
        userId,
        currentQuestion,
        score,
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
