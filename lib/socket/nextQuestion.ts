import { Server } from "socket.io";
import { gameStore } from "./gameStore";
import { startTimer } from "./timers";
import { endGame } from "../game/gameEngine";

export function nextQuestion(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) {
    console.log("NO LOBBY");
    return;
  }

  console.log(
    "NEXT QUESTION:",
    lobby.currentQuestionIndex,
    "/",
    lobby.questions?.length,
  );

  lobby.currentQuestionIndex++;

  console.log("AFTER INCREMENT:", lobby.currentQuestionIndex);

  if (lobby.currentQuestionIndex >= (lobby.questions?.length ?? 0)) {
    console.log("ENDING GAME");

    endGame(io, lobbyId);

    return;
  }

  lobby.players.forEach((player) => {
    player.answered = false;
  });

  const question = lobby.questions?.[lobby.currentQuestionIndex];

  console.log(
    "SENDING QUESTION:",
    lobby.currentQuestionIndex,
    question?.question,
  );

  io.to(lobbyId).emit("next-question", question);

  startTimer(io, lobbyId);
}
