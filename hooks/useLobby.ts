"use client"

import { useLobbyStore }
from "@/store/lobbyStore"

export default function useLobby(){

const {

lobby,
setLobby

}=useLobbyStore()

return {

lobby,
setLobby

}

}