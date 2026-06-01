import { Server, Socket } from "socket.io";

import { gameStore } from "./gameStore";

import { startTimer } from "./timers";

export function quizHandlers(io: Server, socket: Socket) {
socket.on(
  "start-quiz",
  async ({ lobbyId }) => {
    const lobby =
      gameStore.get(lobbyId);

    if (!lobby) return;

    if (
      lobby.questions.length === 0
    ) {
      lobby.questions =
        await generateQuestions();
    }

    lobby.started = true;

    io.to(lobbyId).emit(
      "quiz-started",
      lobby.questions[0]
    );

    startTimer(io, lobbyId);
  }
);
}
function generateQuestions(): import("../../types/question").Question[] | PromiseLike<import("../../types/question").Question[]> {
  throw new Error("Function not implemented.");
}

