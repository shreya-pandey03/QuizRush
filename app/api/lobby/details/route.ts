import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { db } from "@/drizzle/src/db/index";

export async function GET() {
  const data = await db.select().from(rooms);

  return NextResponse.json({
    lobbies: data.map((room) => ({
      id: room.id,
      name: room.name ?? "Quiz Lobby",
      players: room.players ?? 0,
    })),
  });
}