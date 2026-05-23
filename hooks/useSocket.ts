"use client"

import { useEffect } from "react"
import { socket } from "@/lib/socket"
import { useSocketStore } from "@/store/socketStore"

export default function useSocket(){

const {setConnected}=useSocketStore()

useEffect(()=>{

socket.connect()

socket.on(
"connect",
()=>{

setConnected(true)

}
)

socket.on(
"disconnect",
()=>{

setConnected(false)

}
)

return ()=>{

socket.off("connect")
socket.off("disconnect")

}

},[])

}