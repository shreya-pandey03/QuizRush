import { Server } from "socket.io";

import { gameStore } from "./gameStore";

import { nextQuestion } from "./nextQuestion";




export function startTimer(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  lobby.timer = 15;

  const interval = setInterval(() => {
    lobby.timer--;

    io.to(lobbyId).emit("timer-update", lobby.timer);

    

    if (lobby.timer <= 0) {
      clearInterval(interval);

      nextQuestion(io, lobbyId);
    }
  }, 1000);
}
