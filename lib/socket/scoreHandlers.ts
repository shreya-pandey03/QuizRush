import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";

export function scoreHandlers(io: Server, socket: Socket) {
  socket.on(
    "submit-answer",
    ({
      lobbyId,
      playerId,
      answer,
    }: {
      lobbyId: string;
      playerId: string;
      answer: string;
    }) => {
      const lobby = gameStore.get(lobbyId);

      if (!lobby) return;

      const player = lobby.players.find(
        (p) => p.id === playerId,
      );

      if (!player) return;

      const question =
        lobby.questions[lobby.currentQuestionIndex];

      if (!question) return;

      // prevent double answering
      if (player.answered) return;

      player.answered = true;

      // save answer history
      if (!lobby.answers[playerId]) {
        lobby.answers[playerId] = [];
      }

      lobby.answers[playerId].push(answer);

      const isCorrect =
        answer === question.answer;

      if (isCorrect) {
        player.score += 1;
      }

      lobby.scores[playerId] = player.score;

      // send answer result back
      socket.emit("answer-result", {
        selectedAnswer: answer,
        correctAnswer: question.answer,
        isCorrect,
        score: player.score,
      });

      // update everyone
      io.to(lobbyId).emit(
        "leaderboard-update",
        [...lobby.players].sort(
          (a, b) => b.score - a.score,
        ),
      );
    },
  );
}