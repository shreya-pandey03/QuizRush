"use server";

export async function JoinLobby(
  code: string
) {

  const response =
    await fetch(
      "http://localhost:3001/api/lobby/join",
      {
        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({
          code
        })
      }
    );

  const data =
    await response.json();

  return data;
}