import { Server, Socket } from "socket.io";
import { rooms } from "./roomState";

export function quizHandlers(
  io:any,
  socket:any
){

  socket.on(
    "joinRoom",
    (roomId: any)=>{

      socket.join(roomId);

      const count =
        io.sockets.adapter.rooms
        .get(roomId)?.size || 0;

      io.emit(
        "activeLobbyUpdate",
        count
      );
    }
  );

}
