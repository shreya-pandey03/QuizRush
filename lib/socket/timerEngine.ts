import { Server } from "socket.io";
import { rooms } from "./gameStore";

export function startTimer(io: Server) {
  setInterval(() => {
    rooms.forEach((room, roomId) => {
      if (!room.started) return;

      room.timeLeft--;

      io.to(roomId).emit(
        "timerUpdate",
        room.timeLeft
      );

      if (room.timeLeft <= 0) {
        room.currentQuestion++;

        if (
          room.currentQuestion >= room.questions.length
        ) {
          io.to(roomId).emit(
            "quizFinished",
            room.players
          );
          return;
        }

        room.timeLeft = 15;

        io.to(roomId).emit(
          "newQuestion",
          room.questions[room.currentQuestion]
        );
      }
    });
  }, 1000);
}