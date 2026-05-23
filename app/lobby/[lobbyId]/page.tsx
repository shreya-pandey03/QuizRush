import QuizLobbyClient from "./QuizLobbyClient"

interface Props{

params:{
lobbyId:string
}

}

export default function LobbyPage({
params
}:Props){

return(

<QuizLobbyClient
lobbyId={params.lobbyId}
/>

)

}