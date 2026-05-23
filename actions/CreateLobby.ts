"use server";

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
