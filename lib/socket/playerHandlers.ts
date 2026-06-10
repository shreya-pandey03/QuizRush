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

      console.log("USER JOINED ROOM:", socket.id, lobbyId);

      let lobby = gameStore.get(lobbyId);

      // CREATE LOBBY IF NOT EXISTS
      if (!lobby) {
        const dbLobby = await db.query.lobbies.findFirst({
          where: eq(lobbies.code, lobbyId),
        });

        if (!dbLobby?.code || !dbLobby?.hostId) {
          socket.emit("error", "Lobby not found");
          return;
        }

        lobby = {
          id: dbLobby.code,
          hostId: dbLobby.hostId,

          category: "General",
          difficulty: "Easy",

          players: [],
          questions: [],

          currentQuestionIndex: 0,
          timer: 15,

          started: false,

          status: "waiting",

          answers: {},
          scores: {},
        };
      }
      

      if (!lobby) return;

      socket.join(lobbyId);

      socket.data.lobbyId = lobbyId;
      socket.data.playerId = player.id;

      // ✅ REMOVE OLD ENTRY OF SAME PLAYER (prevents duplicates)
      lobby.players = lobby.players.filter((p) => p.id !== player.id);

      // ADD PLAYER
      lobby.players.push({
        id: player.id,
        name: player.name,
        score: 0,
        answered: false,
        socketId: ""
      });

      gameStore.set(lobbyId, lobby);

      io.to(lobbyId).emit(
        "players-update",
        [...lobby.players].sort((a, b) => b.score - a.score)
      );

      // RESYNC IF GAME STARTED
      if (lobby.status === "playing" && lobby.questions.length > 0) {
        socket.emit("quiz-started", lobby.questions);
        socket.emit("timer-update", lobby.timer);
      }
    } catch (err) {
      console.error("JOIN LOBBY ERROR:", err);
      socket.emit("error", "Failed to join lobby");
    }
  });

  // UPDATE SCORE
  socket.on("update-score", ({ lobbyId, playerId, score }) => {
    const lobby = gameStore.get(lobbyId);
    if (!lobby) return;

    const player = lobby.players.find((p) => p.id === playerId);
    if (!player) return;

    player.score = score;

    gameStore.set(lobbyId, lobby);

    io.to(lobbyId).emit(
      "players-update",
      [...lobby.players].sort((a, b) => b.score - a.score)
    );
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const lobbyId = socket.data.lobbyId;
    const playerId = socket.data.playerId;

    if (!lobbyId || !playerId) return;

    const lobby = gameStore.get(lobbyId);
    if (!lobby) return;

    lobby.players = lobby.players.filter((p) => p.id !== playerId);

    gameStore.set(lobbyId, lobby);

    io.to(lobbyId).emit(
      "players-update",
      [...lobby.players].sort((a, b) => b.score - a.score)
    );
  });
}