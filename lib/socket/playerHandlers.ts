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
  //join lobby
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

        if (!dbLobby?.code) {
          socket.emit("error", "Lobby not found");
          return;
        }

        lobby = {
          id: dbLobby.code,

          players: [],

          currentQuestionIndex: 0,
          timer: 15,

          started: false,
          status: "waiting",

          questions: [],

          category: "General",
          difficulty: "Easy",
        };

        gameStore.set(lobbyId, lobby);
      }

      socket.join(lobbyId);

      socket.data.lobbyId = lobbyId;
      socket.data.playerId = player.id;

      // RECONNECT → KEEP SCORE
      const existingPlayer = lobby.players.find((p) => p.id === player.id);

      if (existingPlayer) {
        existingPlayer.socketId = socket.id;
        existingPlayer.name = player.name;
      } else {
        lobby.players.push({
          id: player.id,
          name: player.name,
          score: 0,
          answered: false,
          socketId: socket.id,
        });
      }

      gameStore.set(lobbyId, lobby);

      // UPDATE PLAYERS LIST
      io.to(lobbyId).emit(
        "players-update",
        [...lobby.players].sort((a, b) => b.score - a.score),
      );

      // RESYNC IF QUIZ IS RUNNING
      if (
        lobby.started &&
        lobby.questions &&
        lobby.questions.length > 0 &&
        lobby.currentQuestionIndex >= 0 &&
        lobby.currentQuestionIndex < lobby.questions.length
      ) {
        console.log(
          "RESYNC PLAYER:",
          player.name,
          "QUESTION:",
          lobby.currentQuestionIndex,
        );

        socket.emit("quiz-started", lobby.questions);

        socket.emit("timer-update", lobby.timer);

        socket.emit("next-question", {
          ...lobby.questions[lobby.currentQuestionIndex],
        });

        socket.emit(
          "leaderboard-update",
          [...lobby.players].sort((a, b) => b.score - a.score),
        );
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
      [...lobby.players].sort((a, b) => b.score - a.score),
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
      [...lobby.players].sort((a, b) => b.score - a.score),
    );
  });
}
