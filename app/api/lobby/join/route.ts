import { NextResponse } from "next/server";

import { db } from "@/drizzle/src/db";

import {
  lobbies,
  lobbyPlayers
} from "@/drizzle/src/db/schema";

import { eq } from "drizzle-orm";

export async function POST(
  req: Request
){

  try{

    const {
      code,
      userId
    } = await req.json();

    const lobby =
      await db.query.lobbies.findFirst({

        where:(lobbies,{eq})=>
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

    await db.insert(
      lobbyPlayers
    ).values({

      lobbyId:lobby.id,
      userId

    });

    return NextResponse.json({

      lobbyId:lobby.id

    });

  }catch(error){

    console.log(error);

    return NextResponse.json(
      {error:"Failed"},
      {status:500}
    );
  }
}