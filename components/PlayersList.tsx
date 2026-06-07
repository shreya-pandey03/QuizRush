import { useLobbyStore } from "@/store/lobbyStore";

export default function PlayersList() {
  const players = useLobbyStore((s) => s.players ?? []);

  const sortedPlayers = [...players].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div>
      {/* <h3> Online Players</h3> */}

      {sortedPlayers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-700 p-4 text-center text-neutral-400">
          Waiting for players...
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
            >
              <p className="text-white">{player.name}</p>

              <p className="font-bold text-green-400">
                {player.score}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}