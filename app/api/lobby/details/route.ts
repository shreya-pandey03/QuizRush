import { db } from "@/drizzle/src/db";
import { lobbies,lobbyPlayers } from "@/drizzle/src/db/schema";

import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(lobbies);

  const lobbiesWithPlayers = await Promise.all(
    data.map(async (lobby) => {
      const players = await db
        .select()
        .from(lobbyPlayers)
        .where(eq(lobbyPlayers.lobbyId, lobby.id));

      return {
        ...lobby,
        players: players.length,
      };
    })
  );

  return Response.json(lobbiesWithPlayers);
}