"use client";

import { useLobbyStore } from "@/store/lobbyStore";

export default function PlayersList() {
  const players = useLobbyStore((s) => s.players);

  const sortedPlayers = [...players].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">
          👥 Online Players
        </h2>
      </div>

      {sortedPlayers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-700 p-4 text-center text-neutral-400">
          Waiting for players...
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 font-bold text-orange-400">
                  {index + 1}
                </div>

                <div>
                  <p className="font-medium text-white">
                    {player.name}
                  </p>

                  <p className="text-xs text-neutral-500">
                    Player
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-400">
                  {player.score}
                </p>

                <p className="text-xs text-neutral-500">
                  points
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}