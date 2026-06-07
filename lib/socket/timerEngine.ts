import { Server } from "socket.io";
import { gameStore } from "./gameStore";

export function startTimer(io: Server) {
  setInterval(() => {
    gameStore.forEach((room, roomId) => {
      if (!room.started) return;

      room.timer--;

      io.to(roomId).emit("timerUpdate", room.timer);

      if (room.timer <= 0) {
        room.currentQuestionIndex++;

        if (room.currentQuestionIndex >= room.questions.length) {
          room.started = false;

          io.to(roomId).emit("quizFinished", room.players);

          return;
        }

        room.timer = 15;

        const nextQuestion = room.questions[room.currentQuestionIndex];

        io.to(roomId).emit("newQuestion", {
          question: nextQuestion.question,

          optionA: nextQuestion.optionA,
          optionB: nextQuestion.optionB,
          optionC: nextQuestion.optionC,
          optionD: nextQuestion.optionD,

          answer: nextQuestion.answer,
        });
      }
    });
  }, 1000);
}
