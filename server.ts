import { createServer } from "http";
import { Server } from "socket.io";

import { playerHandlers } from "@/lib/socket/playerHandlers";
import { scoreHandlers } from "@/lib/socket/scoreHandlers";
import { lobbyHandlers } from "@/lib/socket/lobbyHandlers";
import { emitLobbyList } from "@/lib/socket/lobbyBroadcaster";
import "@/lib/socket/cleanup";

const PORT = Number(process.env.PORT) || 3002;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("CONNECTED:", socket.id);

  socket.onAny((event, ...args) => {
    console.log("EVENT:", event, args);
  });

  lobbyHandlers(io, socket);
  playerHandlers(io, socket);
  scoreHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("DISCONNECTED:", socket.id);
    emitLobbyList(io);
  });
});

httpServer.listen(PORT, () => {
  console.log("Socket server running on port", PORT);
});
