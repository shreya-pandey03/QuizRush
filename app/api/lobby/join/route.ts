import { NextResponse } from "next/server";

import { db } from "@/drizzle/src/db";
import { lobbies } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request
) {

  try {

    const { code } =
      await request.json();

    const lobby =
      await db.query.lobbies.findFirst({

        where:(
          lobbies,
          {eq}
        ) =>
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

    return NextResponse.json({

      lobbyId:lobby.id

    });

  }

  catch(error){

    console.log(error);

    return NextResponse.json({
      error:"Server error"
    });

  }

}