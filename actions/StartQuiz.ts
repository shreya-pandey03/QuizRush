"use server";

export async function StartQuiz(lobbyId: string) {
  await fetch(
    "http://localhost:3001/api/lobby/start",

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        lobbyId,
      }),
    },
  );
}
