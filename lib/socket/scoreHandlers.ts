import { Server, Socket } from "socket.io";

import { gameStore } from "@/lib/game/gameStore";

export function scoreHandlers(
  io: Server,
  socket: Socket
) {
  socket.on(
    "submit-answer",
    ({
      lobbyId,
      answer,
    }) => {

      const lobby =
        gameStore.get(
          lobbyId
        );

      if (!lobby) return;

      const question =
        lobby.questions[
          lobby.currentQuestionIndex
        ];

      const player =
        lobby.players.find(
          (p) =>
            p.id ===
            socket.id
        );

      if (!player) return;

      if (
        player.answered
      )
        return;

      player.answered =
        true;

      if (
        answer ===
        question.answer
      ) {

        player.score += 10;

      }

      io.to(lobbyId).emit(
        "leaderboard-update",
        lobby.players.sort(
          (a, b) =>
            b.score -
            a.score
        )
      );

    }
  );
}