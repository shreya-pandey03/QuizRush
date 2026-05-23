export function scoreHandlers(
socket:any
){

socket.on(

"scoreUpdate",

(data)=>{

socket.broadcast.emit(
"scoreUpdated",
data
)

}

)

}