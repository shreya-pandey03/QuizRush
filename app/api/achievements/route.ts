import { NextResponse } from "next/server";
import { db } from "@/drizzle/src/db";
import { achievements } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json([]);
  }

  const result = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, userId));

  return NextResponse.json(result);
}
