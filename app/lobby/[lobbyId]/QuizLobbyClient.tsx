"use client"

import useSocket from "@/hooks/useSocket"
import PlayersList from "@/components/PlayersList"
import QuestionCard from "@/components/QuestionCard"
import QuizTimer from "@/components/QuizTimer"

interface Props{

lobbyId:string

}

export default function QuizLobbyClient({

lobbyId

}:Props){

useSocket()

return(

<div className="p-6">

<h1
className="text-2xl font-bold"
>

Lobby:

{lobbyId}

</h1>

<div
className="mt-6"
>

<PlayersList/>

<QuizTimer/>

<QuestionCard/>

</div>

</div>

)

}