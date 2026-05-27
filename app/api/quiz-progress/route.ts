import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { lobbies, users } from "@/drizzle/src/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { lobbyCode, email } = await req.json();

  // find lobby using code
  const lobby = await db.query.lobbies.findFirst({
    where: (l, { eq }) => eq(l.code, lobbyCode),
  });

  if (!lobby) {
    return NextResponse.json(
      { error: "Lobby not found" },
      { status: 404 }
    );
  }

  // find user using email
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const existing = await db.query.quizProgress.findFirst({
    where: (q) =>
      and(
        eq(q.lobbyId, lobby.id),
        eq(q.userId, user.id)
      ),
  });

  return NextResponse.json(existing);
}