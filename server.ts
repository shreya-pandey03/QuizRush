import { Server } from "socket.io";
// import { gameStore } from "@/lib/socket/gameStore";
import { quizHandlers } from "@/lib/socket/quizHandlers";
// import { scoreHandlers } from "@/lib/socket/scoreHandlers";

import { playerHandlers } from "@/lib/socket/playerHandlers";
import { socket } from "./lib/socket/socket";
import { startTimer } from "./lib/socket/timerEngine";



const io = new Server(3002, {
  cors: {
    origin: "http://localhost:3001",

    methods: ["GET", "POST"],
  },
});

startTimer(io);

const rooms = new Map<string, any>();

io.on("connection", (socket) => {
  console.log("CONNECTED", socket.id, "Total:", io.engine.clientsCount);

  playerHandlers(io, socket);
  quizHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("DISCONNECTED", socket.id, "Total:", io.engine.clientsCount);
  });
});

setInterval(() => {
  rooms.forEach((room, roomId) => {
    if (!room.started) return;

    room.timeLeft--;

    io.to(roomId).emit("timerUpdate", room.timeLeft);

    if (room.timeLeft <= 0) {
      room.currentQuestion++;

      if (room.currentQuestion >= room.questions.length) {
        finishQuiz(roomId);
        return;
      }

      room.timeLeft = 15;

      io.to(roomId).emit("newQuestion", room.questions[room.currentQuestion]);
    }
  });
}, 1000);

socket.on("startQuiz", async (lobbyId) => {
  const room = rooms.get(lobbyId);

  room.started = true;
  room.currentQuestion = 0;
  room.timeLeft = 15;

  io.to(lobbyId).emit("quizStarted", room.questions[0]);
});

console.log("Socket server running on port 3002");

function finishQuiz(roomId: string) {
  const room = rooms.get(roomId);

  const leaderboard =
    room.players.sort(
      (a: { score: number; }, b: { score: number; }) => b.score - a.score
    );

  io.to(roomId).emit(
    "quizFinished",
    leaderboard
  );
}


