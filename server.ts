

import { Server } from "socket.io";
// import { gameStore } from "@/lib/socket/gameStore";
import { quizHandlers } from "@/lib/socket/quizHandlers";
// import { scoreHandlers } from "@/lib/socket/scoreHandlers";

import { playerHandlers } from "@/lib/socket/playerHandlers";

const io = new Server(3002, {
  cors: {
    origin: "http://localhost:3001",

    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(
    "CONNECTED",
    socket.id,
    "Total:",
    io.engine.clientsCount,
  );

  playerHandlers(io, socket);
  quizHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log(
      "DISCONNECTED",
      socket.id,
      "Total:",
      io.engine.clientsCount,
    );
  });
});

console.log("Socket server running on port 3002");
