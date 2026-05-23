"use client"

import {useEffect,useState}
from "react"

export default function QuizTimer(){

const [time,setTime]=
useState(30)

useEffect(()=>{

const interval=
setInterval(()=>{

setTime((prev)=>{

if(prev<=1){

clearInterval(
interval
)

return 0

}

return prev-1

})

},1000)

return ()=>clearInterval(
interval
)

},[])

return(

<div>

Time:

{time}

</div>

)

}