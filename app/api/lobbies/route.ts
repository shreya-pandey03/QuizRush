import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { lobbies } from "@/drizzle/src/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allLobbies = await db
      .select()
      .from(lobbies)
      .orderBy(desc(lobbies.id)); // or createdAt if you have it

    return NextResponse.json(allLobbies);
  } catch (err) {
    console.error("FETCH LOBBIES ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}