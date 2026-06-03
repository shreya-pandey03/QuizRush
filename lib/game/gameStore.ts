import { Lobby } from "@/types/lobby";

export function finishQuiz(lobby: Lobby, userId: string, score: number) {
  const player = lobby.players.find((p) => p.id === userId);

  if (!player) {
    return null;
  }

  player.score = score;

  return {
    player,
    players: lobby.players,
  };
}
