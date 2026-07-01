import { Server } from "socket.io";
import { gameStore } from "./gameStore";

export const timers = new Map<string, ReturnType<typeof setInterval>>();

export function startQuizTimer(io: Server, lobbyId: string) {
  console.log("START QUIZ TIMER CALLED", lobbyId);

  const lobby = gameStore.get(lobbyId);

  if (!lobby?.endTime) {
    console.log("NO endTime FOUND, TIMER NOT STARTED");
    return;
  }

  //  DO NOT reset answerOrder here

  const existing = timers.get(lobbyId);
  if (existing) clearInterval(existing);

  const interval = setInterval(() => {
    const current = gameStore.get(lobbyId);

    if (!current?.endTime) {
      clearInterval(interval);
      timers.delete(lobbyId);
      return;
    }

    current.lastActivity = Date.now(); //  keep alive

    const timeLeft = Math.max(
      0,
      Math.floor((current.endTime - Date.now()) / 1000),
    );

    io.to(lobbyId).emit("timer-update", timeLeft);

    console.log("TIMER:", lobbyId, timeLeft);

    if (timeLeft <= 0) {
      clearInterval(interval);
      timers.delete(lobbyId);

      io.to(lobbyId).emit("quiz-ended", {
        reason: "time-up",
      });
    }
  }, 1000);

  timers.set(lobbyId, interval);
}
