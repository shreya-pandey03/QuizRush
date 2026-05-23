"use client"

export default function Leaderboard({

players

}:any){

return(

<div>

{

players.map(
(player:any)=>(

<div
key={
player.id
}
>

{player.name}

-

{player.score}

</div>

)
)

}

</div>

)

}