import { Server, Socket } from "socket.io";
import { rooms } from "./roomState";

export function scoreHandlers(
io:Server,
socket:Socket
){

socket.on(
"submitAnswer",
({
roomId,
userId,
correct
})=>{

const room=
rooms.get(roomId);

if(!room)
return;

let player=
room.scores.find(
p=>
p.userId===userId
);

if(!player){

player={

userId,
score:0

};

room.scores.push(
player
);

}

if(correct){

player.score++;

}

io.to(roomId).emit(
"scoreUpdated",
room.scores
);

}

);

}