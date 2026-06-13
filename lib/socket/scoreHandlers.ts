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

      if (!lobby) {
        console.log("LOBBY NOT FOUND");
        return;
      }

      const player = lobby.players.find((p) => p.id === playerId);

      if (!player) {
        console.log("PLAYER NOT FOUND");
        return;
      }

      const question = lobby.questions?.[lobby.currentQuestionIndex];

      if (!question) {
        console.log("QUESTION NOT FOUND");
        return;
      }

      // prevent double answer
      if (player.answered) {
        console.log("ALREADY ANSWERED");
        return;
      }

      player.answered = true;

      const isCorrect = answer === question.answer;

      console.log({
        selectedAnswer: answer,
        correctAnswer: question.answer,
        isCorrect,
      });

      if (isCorrect) {
        player.score += 1;
      }

      console.log("UPDATED SCORE:", player.name, player.score);

      socket.emit("answer-result", {
        selectedAnswer: answer,
        correctAnswer: question.answer,
        isCorrect,
        score: player.score,
      });

      io.to(lobbyId).emit(
        "leaderboard-update",
        [...lobby.players].sort((a, b) => b.score - a.score),
      );

      console.log(
        "EMITTING LEADERBOARD:",
        lobby.players.map((p) => ({
          name: p.name,
          score: p.score,
        })),
      );
      io.to(lobbyId).emit(
        "players-update",
        [...lobby.players].sort((a, b) => b.score - a.score),
      );
    },
  );
}
