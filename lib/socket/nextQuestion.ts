import { Server } from "socket.io";

import { gameStore } from "./gameStore";

import { startTimer } from "./timers";

export function nextQuestion(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  lobby.currentQuestionIndex++;

  lobby.players.forEach((player) => {
    player.answered = false;
  });

  const question = lobby.questions[lobby.currentQuestionIndex];

  if (!question) {
    return;
  }

  io.to(lobbyId).emit("next-question", question);

  startTimer(io, lobbyId);
}
