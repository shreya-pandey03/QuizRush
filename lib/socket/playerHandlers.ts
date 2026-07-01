import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";

export function playerHandlers(io: Server, socket: Socket) {
  socket.on("update-score", ({ lobbyId, playerId, score }) => {
    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    if (Date.now() - (lobby.submittedAt[playerId] || 0) < 500) {
      return;
    }

    lobby.submittedAt[playerId] = Date.now();

    const player = lobby.players.find((p) => p.id === playerId);

    if (!player) return;

    player.score = score;

    io.to(lobbyId).emit(
      "players-update",
      [...lobby.players].sort((a, b) => b.score - a.score),
    );
  });

  socket.on("request-resync", ({ lobbyId }) => {
    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    socket.emit("quiz-resync", {
      questions: lobby.questions,
      startTime: lobby.startTime,
      endTime: lobby.endTime,
      duration: lobby.duration,
    });
  });

  socket.on("disconnect", () => {
    console.log("DISCONNECTED:", socket.id);
  });
}
