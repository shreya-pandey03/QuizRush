import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";
import { startTimer } from "./timers";
import { Question } from "../../types/question";

export function quizHandlers(io: Server, socket: Socket) {
  socket.on("start-quiz", async ({ lobbyId }) => {
    console.log("START QUIZ RECEIVED", lobbyId);

    const lobby = gameStore.get(lobbyId);

    if (!lobby) {
      console.log("LOBBY NOT FOUND");
      return;
    }

    if (lobby.questions.length === 0) {
      lobby.questions = await generateQuestions();
    }

    lobby.started = true;

    io.to(lobbyId).emit("quiz-started", lobby.questions[0]);

    startTimer(io, lobbyId);

    console.log("QUIZ STARTED");
  });
}

async function generateQuestions(): Promise<Question[]> {
  return [
    {
      question: "What is the capital of India?",
      options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
      answer: "Delhi",
    },
    {
      question: "2 + 2 = ?",
      options: ["2", "4", "8", "10"],
      answer: "4",
    },
    {
      question: "Largest planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: "Jupiter",
    },
  ];
}