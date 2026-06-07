import { Server } from "socket.io";
import { timers } from "./timers";
import { gameStore } from "@/lib/socket/gameStore";



export function startGame(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  lobby.started = true;
  lobby.status = "playing";
  lobby.currentQuestionIndex = 0;

  sendQuestion(io, lobbyId);
  startTimer(io, lobbyId);
}

export function sendQuestion(io: Server, lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  const question =
    lobby.questions[lobby.currentQuestionIndex];

  if (!question) return;

  io.to(lobbyId).emit("new-question", {
    question: {
      question: question.question,

      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,

      answer: question.answer,
    },
  });
}

export function startTimer(
  io: Server,
  lobbyId: string,
) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  const oldTimer = timers.get(lobbyId);

  if (oldTimer) {
    clearInterval(oldTimer);
  }

  lobby.timer = 15;

  const interval = setInterval(() => {
    const currentLobby =
      gameStore.get(lobbyId);

    if (!currentLobby) {
      clearInterval(interval);
      return;
    }

    currentLobby.timer--;

    io.to(lobbyId).emit("timer-update", {
      timeLeft: currentLobby.timer,
    });

    if (currentLobby.timer <= 0) {
      clearInterval(interval);

      timers.delete(lobbyId);

      nextQuestion(io, lobbyId);
    }
  }, 1000);

  timers.set(lobbyId, interval);
}

export function nextQuestion(
  io: Server,
  lobbyId: string,
) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  lobby.currentQuestionIndex++;

  if (
    lobby.currentQuestionIndex >=
    lobby.questions.length
  ) {
    lobby.status = "finished";

    io.to(lobbyId).emit("quiz-ended", {
      leaderboard: [...lobby.players].sort(
        (a, b) => b.score - a.score,
      ),
    });

    return;
  }

  lobby.players.forEach((player: { answered: boolean; })=> {
    player.answered = false;
  });

  sendQuestion(io, lobbyId);

  startTimer(io, lobbyId);
}