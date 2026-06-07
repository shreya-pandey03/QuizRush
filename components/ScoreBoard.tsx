"use client";

import { useLobbyStore } from "@/store/lobbyStore";

export default function ScoreBoard() {
  const players = useLobbyStore((s) => s.players);

  const sorted = [...players].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <h2 className="mb-4 text-xl font-bold text-white">
        🏆 Leaderboard
      </h2>

      {sorted.length === 0 ? (
        <p className="text-neutral-400">
          No players yet
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-neutral-400">
                  #{index + 1}
                </span>

                <span className="text-white">
                  {player.name}
                </span>
              </div>

              <span className="font-bold text-green-400">
                {player.score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}