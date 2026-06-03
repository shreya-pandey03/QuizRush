"use client";

import { useLobbyStore } from "@/store/lobbyStore";

export default function PlayersList() {
  const players = useLobbyStore((s) => s.players);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  console.log(sortedPlayers);
  console.log("Players Store:", players);
  console.log("PLAYERS COUNT:", players.length, players);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">👥 Online Players</h2>
      </div>

      {sortedPlayers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-700 p-4 text-center text-neutral-400">
          Waiting for players...
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPlayers.map((player, _index) => {
            console.log("RENDERING PLAYER:", player);
            console.log(player);

            return (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
              >
                <div>
                  <p className="text-white">{player.name}</p>
                </div>
                <div>
                  <p className="text-green-400 font-bold">{player.score}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
