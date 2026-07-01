import { NextResponse } from "next/server";

import { db } from "@/drizzle/src/db";
import { lobbies, lobbyPlayers } from "@/drizzle/src/db/schema";

import { gameStore } from "@/lib/socket/gameStore";
import { generateQuestions } from "@/lib/ai/generateQuestions";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { name, hostId, hostName } = await req.json();

    const lobby = await db
      .insert(lobbies)
      .values({
        name,
        hostId,
        hostName,
        code: generateCode(),
      })
      .returning();

    const lobbyDbId = lobby[0].id;
    const roomCode = lobby[0].code!;

    const generatedQuestions = await generateQuestions("General", "Easy", 10);

    gameStore.set(roomCode, {
      id: roomCode,
      lobbyId: roomCode,

      hostId,
      hostName,

      status: "waiting",

      category: "General",
      difficulty: "Easy",

      players: [],
      spectators: [],

      questions: generatedQuestions,

      currentQuestionIndex: 0,
      timer: 15,

      started: false,
      locked: false,

      answers: {},
      scores: {},

      correctAnswers: {},
      bonuses: {},

      ready: {},

      submitted: new Set<string>(),
      submittedAt: {},

      answerOrder: [],

      startTime: undefined,
      endTime: undefined,
      duration: undefined,

      createdAt: Date.now(),
      lastActivity: Date.now(),
    });

    await db.insert(lobbyPlayers).values({
      lobbyId: lobbyDbId,
      userId: hostId,
    });

    return NextResponse.json({
      success: true,
      lobbyId: roomCode,
      roomCode,
    });
  } catch (error) {
    console.error("CREATE LOBBY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create lobby",
      },
      {
        status: 500,
      },
    );
  }
}
