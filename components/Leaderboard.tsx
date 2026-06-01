"use client";

type Player = {
  id: string;
  name: string;
  score: number;
};

interface LeaderboardProps {
  players: Player[];
}

export default function Leaderboard({
  players,
}: LeaderboardProps) {
  const sortedPlayers = [...players].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
      <h2 className="mb-4 text-xl font-bold text-white">
        🏆 Leaderboard
      </h2>

      <div className="space-y-3">
        {sortedPlayers.map(
          (player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-black/40 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-bold text-orange-400">
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
          )
        )}
      </div>
    </div>
  );
}