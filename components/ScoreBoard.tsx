"use client";

import { useLobbyStore } from "@/store/lobbyStore";

export default function ScoreBoard() {
  const players = useLobbyStore(
    (s) => s.players
  );

  const sorted = [...players].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="bg-neutral-900 p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        Leaderboard
      </h2>

      {sorted.map((player, index) => (
        <div
          key={player.id}
          className="
            flex
            justify-between
            py-2
            border-b
            border-neutral-800
          "
        >
          <span>
            #{index + 1} {player.name}
          </span>

          <span>{player.score}</span>
        </div>
      ))}
    </div>
  );
}