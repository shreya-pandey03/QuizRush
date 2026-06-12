"use server";

import { gameStore } from "@/lib/socket/gameStore";

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
  gameStore.set(lobbyId, {
    id: lobbyId,

    players: [],

    currentQuestionIndex: 0,
    timer: 15,

    started: false,
    status: "created",

    questions: [],

    category: "General",
    difficulty: "Easy",
  });

  return lobbyId;
}
