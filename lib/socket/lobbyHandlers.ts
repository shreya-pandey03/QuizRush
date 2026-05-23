import { Server } from "socket.io";

export function lobbyHandlers(io: Server, socket: any) {
  socket.on(
    "joinLobby",

    (roomId) => {
      socket.join(roomId);

      io.to(roomId).emit("playerJoined");
    },
  );
}
