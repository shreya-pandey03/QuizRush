import { Server } from "socket.io";
import { quizHandlers } from "@/lib/socket/quizHandlers";
import { playerHandlers } from "@/lib/socket/playerHandlers";
import { startTimer } from "@/lib/socket/timerEngine";
import { scoreHandlers } from "@/lib/socket/scoreHandlers";

const io = new Server(3002, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("CONNECTED", socket.id, "Total:", io.engine.clientsCount);

  playerHandlers(io, socket);
  quizHandlers(io, socket);
  scoreHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("DISCONNECTED", socket.id, "Total:", io.engine.clientsCount);
  });
});

startTimer(io);

console.log("Socket server running on port 3002");
