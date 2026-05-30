import { Server, Socket } from "socket.io";

import { gameStore } from "./gameStore";

export function playerHandlers(io: Server, socket: Socket) {
  socket.on("join-lobby", ({ lobbyId, player }) => {
    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    socket.join(lobbyId);

    const exists = lobby.players.find((p) => p.id === player.id);

    if (!exists) {
      lobby.players.push({
        ...player,
        score: 0,
        answered: false,
      });
    }

    io.to(lobbyId).emit("players-update", lobby.players);
  });

  socket.on(
  "create-lobby",
  ({
    lobbyId,
    hostId,
  }) => {

    gameStore.set(
      lobbyId,
      {
        id: lobbyId,

        hostId,

        players: [],

        questions: [],

        currentQuestionIndex: 0,

        timer: 15,

        started: false,
      }
    );

  }
);
}
