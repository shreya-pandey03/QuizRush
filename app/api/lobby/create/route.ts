import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { lobbies } from "@/drizzle/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const roomCode = Math.random().toString(36).slice(2, 8);

    await db.insert(lobbies).values({
      name: body.name,

      hostId: body.hostId,

      code: roomCode,
    });

    return NextResponse.json({
      success: true,

      code: roomCode,
    });
  } catch {
    return NextResponse.json(
      { success: false },

      { status: 500 },
    );
  }
}
