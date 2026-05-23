export function quizHandlers(
socket:any
){

socket.on(

"submitAnswer",

(data)=>{

socket.broadcast.emit(
"answerSubmitted",
data
)

}

)

}