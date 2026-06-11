import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";
import { startTimer } from "./timers";
import { generateQuestions } from "@/lib/ai/generateQuestions";

export function quizHandlers(io: Server, socket: Socket) {
  socket.on("start-quiz", async ({ lobbyId }) => {
    try {
      console.log("START QUIZ RECEIVED:", lobbyId);

      const lobby = gameStore.get(lobbyId);

      if (!lobby) {
        console.log("LOBBY NOT FOUND");
        return;
      }

      if (!lobby.questions || lobby.questions.length === 0) {
        const generatedQuestions = await generateQuestions(
          String(lobby.category),
          String(lobby.difficulty),
          10,
        );

        console.log("GENERATED QUESTIONS:", generatedQuestions);
        console.log("COUNT:", generatedQuestions?.length);

        if (!generatedQuestions || generatedQuestions.length === 0) {
          console.log("NO QUESTIONS GENERATED");
          return;
        }

        lobby.questions = generatedQuestions;
      }

      lobby.started = true;

      console.log("EMITTING quiz-started:", lobby.questions.length);

      io.to(lobbyId).emit("quiz-started", lobby.questions);

      startTimer(io, lobbyId);
    } catch (error) {
      console.error("START QUIZ ERROR:", error);
    }
  });

  socket.on("request-quiz-state", ({ lobbyId }) => {
    console.log("REQUEST QUIZ STATE:", lobbyId);

    const lobby = gameStore.get(lobbyId);

    console.log("LOBBY FOUND:", lobby);

    if (!lobby) {
      socket.emit("quiz-state", {
        started: false,
        questions: [],
      });
      return;
    }

    console.log("QUESTIONS COUNT:", lobby.questions?.length);

    socket.emit("quiz-state", {
      started: lobby.started,
      questions: lobby.questions,
    });
  });

}

