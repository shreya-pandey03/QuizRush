import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import {
  lobbies,
  lobbyPlayers
} from "@/drizzle/src/db/schema";
import { gameStore }
  from "@/lib/socket/gameStore";
function generateCode() {
  return Math.random()
    .toString(36)
    .substring(2,8)
    .toUpperCase();
}


export async function POST(req: Request) {
  try {

    const {
      name,
      hostId
    } = await req.json();

const lobby = await db
  .insert(lobbies)
  .values([
    {
      name,
      hostId,
      code: generateCode(),
    },
  ])
  .returning();

  gameStore.set(
  lobby[0].id,
  {
    id: lobby[0].id,

    hostId,

    players: [],

    questions: [],

    currentQuestionIndex: 0,

    timer: 15,

    started: false,
  }
);

    // host automatically joins own room
    await db.insert(lobbyPlayers)
      .values({
        lobbyId: lobby[0].id,
        userId: hostId
      });

    return NextResponse.json({
      success:true,
      lobbyId:lobby[0].id,
      roomCode:lobby[0].code
    });

  } catch(error) {

    console.log(error);

    return NextResponse.json(
      {success:false},
      {status:500}
    );
  }
}