import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import {
  lobbies,
  lobbyPlayers,
} from "@/drizzle/src/db/schema";

import { eq } from "drizzle-orm";

import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    const userId = session?.user?.email;

    if (!userId) {
      return NextResponse.json(
        {
          error: "Please sign in first",
        },
        {
          status: 401,
        }
      );
    }

    const { code } = await req.json();

    const lobby = await db.query.lobbies.findFirst({
      where: eq(
        lobbies.code,
        code.toUpperCase()
      ),
    });

    if (!lobby) {
      return NextResponse.json(
        {
          error: "Lobby not found",
        },
        {
          status: 404,
        }
      );
    }

    // check if already joined
    const existingPlayer =
      await db.query.lobbyPlayers.findFirst({
        where: (players, { and, eq }) =>
          and(
            eq(players.userId, userId),
            eq(players.lobbyId, lobby.id)
          ),
      });

    if (!existingPlayer) {
      await db.insert(
        lobbyPlayers
      ).values({
        lobbyId: lobby.id,
        userId: userId,
      });
    }

    return NextResponse.json({
      success: true,
      lobbyId: lobby.id,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}