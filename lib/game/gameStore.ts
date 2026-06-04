import { Lobby } from "@/types/lobby";

export const gameStore = new Map<string, Lobby>();

export function finishQuiz(lobbyId: string, userId: string, score: number) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return null;

  const player = lobby.players.find((p: { id: string; }) => p.id === userId);

  if (!player) return null;

  player.score = score;

  return {
    player,
    players: lobby.players,
  };
}


