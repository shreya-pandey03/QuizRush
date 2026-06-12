import { LobbyState } from "@/lib/socket/gameStore";

export function finishQuiz(lobby: LobbyState, userId: string) {
  const player = lobby.players.find((p) => p.id === userId);

  if (!player) return null;

  // OPTIONAL: recompute score server-side (recommended)
  // If you already increment score in submitAnswer, just keep it
  const score = player.score;

  return {
    player: {
      id: player.id,
      name: player.name,
      score,
    },
    players: lobby.players,
  };
}