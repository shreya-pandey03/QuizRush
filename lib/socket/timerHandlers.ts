export function timerHandlers(
socket:any
){

socket.on(

"timerUpdate",

(data)=>{

socket.broadcast.emit(
"timerUpdated",
data
)

}

)

}