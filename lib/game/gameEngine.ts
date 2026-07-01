// import { Server } from "socket.io";
// import { gameStore } from "@/lib/socket/gameStore";
// import { loadQuestionsFromDB } from "./questionManager";
// import { startQuizTimer } from "../socket/timers";

// export async function startGame(io: Server, lobbyId: string) {
//   const lobby = gameStore.get(lobbyId);

//   if (!lobby) {
//     console.log("LOBBY NOT FOUND");
//     return;
//   }

//   if (lobby.status === "playing") {
//     console.log("START BLOCKED - already playing");
//     return;
//   }

//   lobby.locked = true;
//   lobby.started = true;
//   lobby.status = "playing";

//   const questions = await loadQuestionsFromDB(lobbyId);

//   if (!questions || questions.length === 0) {
//     console.log("NO QUESTIONS FOUND");

//     lobby.locked = false;
//     lobby.status = "waiting";
//     gameStore.set(lobbyId, lobby);
//     return;
//   }

//   lobby.questions = questions;

//   // reset state
//   lobby.currentQuestionIndex = 0;
//   lobby.answers = {};
//   lobby.scores = {};

//   lobby.players = lobby.players.map((p) => ({
//     ...p,
//     score: 0,
//     answered: false,
//   }));

//   //  GLOBAL TIMER (YOUR STYLE)
//   const TOTAL_TIME = questions.length * 20; // or 20 if you want slower game

//   lobby.duration = TOTAL_TIME;
//   lobby.startTime = Date.now();
//   lobby.endTime = lobby.startTime + TOTAL_TIME * 1000;

//   gameStore.set(lobbyId, lobby);

//   console.log("STARTING GLOBAL TIMER FOR", lobbyId);

//   startQuizTimer(io, lobbyId);

//   io.to(lobbyId).emit("quiz-started", {
//     lobbyId,
//     questions: lobby.questions,
//     currentQuestionIndex: 0,
//     startTime: lobby.startTime,
//     endTime: lobby.endTime,
//     duration: lobby.duration,
//     status: lobby.status,
//   });

//   console.log("QUIZ STARTED SUCCESSFULLY:", lobbyId);
// }
