import { NextRequest, NextResponse } from "next/server";
import { gameStore } from "@/lib/socket/gameStore";

export async function GET(req: NextRequest) {
  const lobbyId = req.nextUrl.searchParams.get("lobbyId");

  if (!lobbyId) {
    return NextResponse.json(
      { error: "Lobby ID is required" },
      { status: 400 }
    );
  }

  const lobby = gameStore.get(lobbyId);

  if (!lobby) {
    return NextResponse.json(
      { error: "Lobby not found" },
      { status: 404 }
    );
  }

  const leaderboard = [...lobby.players].sort(
    (a, b) => b.score - a.score
  );

  return NextResponse.json({
    success: true,
    leaderboard,
  });
}