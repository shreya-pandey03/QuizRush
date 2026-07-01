import { gameStore } from "./gameStore";

setInterval(() => {
  for (const [id, lobby] of gameStore.entries()) {
    if (
      lobby.players.length === 0 &&
      Date.now() - lobby.lastActivity >
        1000 * 60 * 30
    ) {
      console.log(
        "Deleting inactive lobby:",
        id
      );

      gameStore.delete(id);
    }
  }
}, 60000);