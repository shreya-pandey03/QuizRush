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
    console.log("USER JOINED ROOM:", socket.id, payload.lobbyId);

    try {
      const { lobbyId, player } = payload;

      let lobby = gameStore.get(lobbyId);

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

          status: "waiting",

          players: [],

          questions: [],

          currentQuestionIndex: 0,

          timer: 15,

          started: false,

          answers: {},

          scores: {},
        };

        gameStore.set(lobbyId, lobby);
      }

      socket.join(lobbyId);

      // IMPORTANT
      socket.data.lobbyId = lobbyId;

      const index = lobby.players.findIndex((p) => p.id === player.id);

      if (index !== -1) {
        // reconnect
        lobby.players[index] = {
          ...lobby.players[index],
          name: player.name,
          socketId: socket.id,
        };
      } else {
        // new player
        lobby.players.push({
          id: player.id,
          name: player.name,
          score: 0,
          answered: false,
          socketId: socket.id,
        });
      }

      io.to(lobbyId).emit(
        "players-update",
        [...lobby.players].sort((a, b) => b.score - a.score),
      );

      // if quiz already started, send quiz state
      if (lobby.started && lobby.questions.length > 0) {
        socket.emit("quiz-started", lobby.questions);

        socket.emit("timer-update", {
          timeLeft: lobby.timer,
        });
      }
    } catch (err) {
      console.error("JOIN LOBBY ERROR:", err);

      socket.emit("error", "Failed to join lobby");
    }
  });

  socket.on(
    "update-score",
    ({
      lobbyId,
      playerId,
      score,
    }: {
      lobbyId: string;
      playerId: string;
      score: number;
    }) => {
      const lobby = gameStore.get(lobbyId);

      if (!lobby) return;

      const player = lobby.players.find((p) => p.id === playerId);

      if (!player) return;

      player.score = score;

      io.to(lobbyId).emit("players-update", lobby.players);
    },
  );

  socket.on("disconnect", () => {
    const lobbyId = socket.data.lobbyId;

    if (!lobbyId) return;

    const lobby = gameStore.get(lobbyId);
    if (!lobby) return;

    lobby.players = lobby.players.filter((p) => p.socketId !== socket.id);

    io.to(lobbyId).emit("players-update", lobby.players);
  });
}
