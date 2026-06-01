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
    const { lobbyId, player } = payload;

    // ✅ FIX 1: guard lobbyId
    if (!lobbyId || typeof lobbyId !== "string") return;

    let lobby = gameStore.get(lobbyId);

    // 🔥 FIX 2: handle missing lobby safely
    if (!lobby) {
      const dbLobby = await db.query.lobbies.findFirst({
        where: eq(lobbies.code, lobbyId),
      });

      if (!dbLobby) {
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

    // 🔥 FIX 3: ensure lobby exists after creation
    if (!lobby) return;

    socket.join(lobbyId);

    const exists = lobby.players.find((p) => p.id === player.id);

    if (!exists) {
      lobby.players.push({
        id: player.id,
        name: player.name,
        score: 0,
        answered: false,
      });
    }

    io.to(lobbyId).emit("players-update", lobby.players);
  });
}