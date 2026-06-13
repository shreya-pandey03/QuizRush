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

        if (room.currentQuestionIndex >= (room.questions?.length ?? 0)) {
          room.started = false;

          io.to(roomId).emit("quizFinished", {
            leaderboard: [...room.players].sort((a, b) => b.score - a.score),
          });

          room.currentQuestionIndex = 0;
          room.timer = 15;

          room.players.forEach((p) => {
            p.answered = false;
          });

          return;
        }

        room.timer = 15;

        const nextQuestion = room.questions?.[room.currentQuestionIndex];

        if (!nextQuestion) return;

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
