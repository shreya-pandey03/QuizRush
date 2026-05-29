import { Server } from "socket.io";
import { rooms } from "./roomState";

export function timerHandlers(io: Server) {
  setInterval(() => {
  Object.entries(rooms).forEach(([roomId, room]: any) => {
  if (!room.started) return;

  room.timeLeft--;

  io.to(roomId).emit("timerUpdate", room.timeLeft);

  if (room.timeLeft <= 0) {
    room.timeLeft = 30;
    room.currentQuestion++;

    io.to(roomId).emit("questionChanged", {
      questionIndex: room.currentQuestion,
    });
  }
});
    }, 1000);
}