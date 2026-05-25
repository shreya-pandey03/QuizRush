import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { lobbies } from "@/drizzle/src/db/schema";

function generateCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

export async function POST(
  req: Request
) {

  try {

    const {
      name,
      hostId
    } = await req.json();

    const roomCode =
      generateCode();

    const lobby =
      await db
      .insert(lobbies)
      .values({
        name,
        hostId,
        code: roomCode
      })
      .returning();

    return NextResponse.json({

      success:true,

      lobbyId:
      lobby[0].id,

      roomCode:
      roomCode

    });

  } catch(error){

    console.log(error);

    return NextResponse.json(
      {
        success:false
      },
      {
        status:500
      }
    );

  }

}