import { Server, Socket } from "socket.io";
import { rooms } from "./roomState";

export function quizHandlers(
  io: Server,
  socket: Socket
){

socket.on(
"startQuiz",
(roomId:string)=>{

const room=rooms.get(roomId);

if(!room)return;

room.started=true;

room.currentQuestion=0;

io.to(roomId).emit(
"quizStarted",
{
questionIndex:0
}
);

}
);

socket.on(
"nextQuestion",
(roomId:string)=>{

const room=rooms.get(roomId);

if(!room)return;

room.currentQuestion++;

io.to(roomId).emit(
"questionChanged",
{
questionIndex:
room.currentQuestion
}
);

}
);

}