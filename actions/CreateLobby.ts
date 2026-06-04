"use server";

import { rooms } from "@/lib/socket/gameStore";

export async function CreateLobby(name: string, hostId: string) {
  const response = await fetch("http://localhost:3001/api/lobby/create", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,
      hostId,
    }),
  });

  return response.json();
}

export async function createLobby(lobbyId: string) {

  rooms.set(lobbyId, {
    started: false,
    currentQuestion: 0,
    timeLeft: 15,
    questions: [],
    players: [],
  });

  return lobbyId;
}
