import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import {
  
  lobbyPlayers
} from "@/drizzle/src/db/schema";


export async function POST(req: Request) {

  const {
    code,
    userId
  } = await req.json();

  const lobby =
    await db.query.lobbies.findFirst({
      where:(lobbies,{eq}) =>
      eq(
        lobbies.code,
        code
      )
    });

  if(!lobby){

    return NextResponse.json({
      error:"Lobby not found"
    });

  }

  const alreadyJoined =
    await db.query.lobbyPlayers.findFirst({
      where:(players,{and,eq}) =>
      and(
        eq(players.userId,userId),
        eq(players.lobbyId,lobby.id)
      )
    });

  if(!alreadyJoined){

    await db.insert(
      lobbyPlayers
    ).values({

      userId,
      lobbyId:lobby.id

    });

  }

  return NextResponse.json({

    lobbyId:lobby.id

  });

}