import { Server } from "socket.io";

import { quizHandlers } from "@/lib/socket/quizHandlers";

import { timerHandlers } from "@/lib/socket/timerHandlers";

import { scoreHandlers } from "@/lib/socket/scoreHandlers";

const lobbyPlayers:
Record<
  string,
  {
    socketId: string;
    userId: string;
  }[]
> = {};

const io = new Server(3002, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join multiplayer room
socket.on(
  "joinRoom",
  ({
    roomId,
    userId,
  }: {
    roomId: string;
    userId: string;
  }) => {

    socket.join(
      roomId
    );

    console.log(
      `${userId} joined ${roomId}`
    );

    // Create room if missing

    if (
      !lobbyPlayers[
        roomId
      ]
    ) {

      lobbyPlayers[
        roomId
      ] = [];

    }

    // Prevent duplicates

    const exists =
      lobbyPlayers[
        roomId
      ].find(
        player =>
          player.userId ===
          userId
      );

    if (!exists) {

      lobbyPlayers[
        roomId
      ].push({
        socketId:
          socket.id,
        userId,
      });

    }

    // Send updated players

    io.to(roomId).emit(
      "playersUpdate",
      lobbyPlayers[
        roomId
      ]
    );

  }
);

  quizHandlers(io, socket);

  scoreHandlers(io, socket);

socket.on(
  "disconnect",
  () => {

    Object.keys(
      lobbyPlayers
    ).forEach(
      roomId => {

        lobbyPlayers[
          roomId
        ] =
          lobbyPlayers[
            roomId
          ].filter(
            player =>
              player.socketId !==
              socket.id
          );

        io.to(roomId).emit(
          "playersUpdate",
          lobbyPlayers[
            roomId
          ]
        );

      }
    );

    console.log(
      "Disconnected:",
      socket.id
    );

  }
);

timerHandlers(io);

console.log("Socket server running on port 3002");
