import { Server } from "socket.io";

import { quizHandlers } from "@/lib/socket/quizHandlers";

import { scoreHandlers } from "@/lib/socket/scoreHandlers";

import { playerHandlers } from "@/lib/socket/playerHandlers";

const io = new Server(3002, {
  cors: {
    origin: "http://localhost:3001",

    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  playerHandlers(io, socket);

  quizHandlers(io, socket);

  scoreHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

console.log("Socket server running on port 3002");
