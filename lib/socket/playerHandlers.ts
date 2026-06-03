import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";
import { db } from "@/drizzle/src/db";
import { lobbies } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

type JoinLobbyPayload = {
  lobbyId: string;
  player: {
    id: string;
    name: string;
  };
};

export function playerHandlers(io: Server, socket: Socket) {
  socket.on("join-lobby", async (payload: JoinLobbyPayload) => {
    try {
      const { lobbyId, player } = payload;

      console.log("JOIN LOBBY RECEIVED");
      console.log(lobbyId);
      console.log(player);

      let lobby = gameStore.get(lobbyId);

      console.log("Lobby Found:", !!lobby);

      if (!lobby) {
        console.log("Searching DB for:", lobbyId);

        const dbLobby = await db.query.lobbies.findFirst({
          where: eq(lobbies.code, lobbyId),
        });

        console.log("DB Lobby:", dbLobby);

        if (!dbLobby?.code || !dbLobby?.hostId) {
          socket.emit("error", "Lobby not found");
          return;
        }

        lobby = {
          id: dbLobby.code,
          hostId: dbLobby.hostId,
          players: [],
          currentQuestionIndex: 0,
          questions: [],
          timer: 15,
          started: false,
        };

        gameStore.set(lobbyId, lobby);
      }

      socket.join(lobbyId);

      const existingPlayer = lobby.players.find((p) => p.id === player.id);

      if (!existingPlayer) {
        lobby.players.push({
          id: player.id,
          name: player.name,
          score: 0,
          answered: false,
          socketId: socket.id,
        });
      }

      console.log("Players:", lobby.players);

      io.to(lobbyId).emit("players-update", lobby.players);

      io.to(lobbyId).emit("players-update", lobby.players);

      console.log("PLAYERS UPDATE EMITTED");
    } catch (err) {
      console.error("JOIN LOBBY ERROR:");
      console.error(err);
    }
  });

  socket.on("update-score", ({ lobbyId, playerId, score }) => {
    console.log("UPDATE SCORE RECEIVED", lobbyId, playerId, score);

    const lobby = gameStore.get(lobbyId);

    console.log("ALL LOBBIES:");
    console.log([...gameStore.keys()]);

    console.log("REQUESTED LOBBY:");
    console.log(lobbyId);

    if (!lobby) {
      console.log("LOBBY NOT FOUND");
      return;
    }

    const player = lobby.players.find((p) => p.id === playerId);

    if (!player) {
      console.log("PLAYER NOT FOUND");
      return;
    }

    player.score = score;

    console.log("PLAYER SCORE UPDATED", player.name, player.score);

    io.to(lobbyId).emit("players-update", lobby.players);
  });
}
