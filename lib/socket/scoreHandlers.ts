import { Server, Socket } from "socket.io";

import { gameStore } from "./gameStore";

export function scoreHandlers(io: Server, socket: Socket) {
  socket.on("submit-answer", ({ lobbyId, playerId, answer }) => {
    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    const player = lobby.players.find((p) => p.id === playerId);

    if (!player) return;

    if (player.answered) return;

    const question = lobby.questions[lobby.currentQuestionIndex];

    if (answer === question.answer) {
      player.score += 10;
    }

    player.answered = true;

    io.to(lobbyId).emit("leaderboard-update", lobby.players);
  });
}
