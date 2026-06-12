import { db } from "@/drizzle/src/db";
import { gameStore } from "@/types/lobby";

import type { RejoinLobbyPayload } from "@/types/socket";

export async function lobbyHandlers(io: any, socket: any) {
  async function sendActiveLobbies() {
    const lobbies = await db.query.lobbies.findMany({
      where: (l, { eq }) => eq(l.isStarted, false),
    });

    io.emit("activeLobbiesUpdated", lobbies);
  }

  socket.on("createLobby", async () => {
    await sendActiveLobbies();
  });

  socket.on("joinLobby", async () => {
    await sendActiveLobbies();
  });

  socket.on("leaveLobby", async () => {
    await sendActiveLobbies();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("rejoin-lobby", ({ lobbyId, userId }: RejoinLobbyPayload) => {
    const lobby = gameStore.get(lobbyId);
    if (!lobby) return;

    const player = lobby.players.find((p) => p.id === userId);
    if (!player) return;

    player.socketId = socket.id;

    // SERVER ONLY
    socket.join(lobbyId);

    socket.emit("lobby-state", lobby);
  });
}
