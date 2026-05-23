import express from "express";

import http from "http";

import { Server } from "socket.io";

import { lobbyHandlers } from "@/lib/socket/lobbyHandlers";

import { quizHandlers } from "@/lib/socket/quizHandlers";

import { timerHandlers } from "@/lib/socket/timerHandlers";

import { scoreHandlers } from "@/lib/socket/scoreHandlers";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});

io.on(
  "connection",

  (socket) => {
    console.log(socket.id, "connected");

    lobbyHandlers(io, socket);

    quizHandlers(socket);

    timerHandlers(socket);

    scoreHandlers(socket);
  },
);

server.listen(
  4000,

  () => {
    console.log("Socket Server Running on 4000");
  },
);
