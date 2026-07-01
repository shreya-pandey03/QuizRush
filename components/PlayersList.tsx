import { useLeaderboardStore } from "@/store/leaderboardStore";

export default function PlayersList() {
  const players = useLeaderboardStore((s) => s.leaderboard);
  console.log("PLAYERS LIST RENDER", players);
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  
  return (
    <div>
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
              {/* Left side: Avatar + Name */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: !player.photo
                      ? "linear-gradient(135deg, rgba(234,120,30,.3), rgba(234,120,30,.1))"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {player.photo ? (
                    <img
                      src={player.photo}
                      alt={player.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {player.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name */}
                <p className="text-white">{player.name}</p>
              </div>

              {/* Score */}
              <p className="font-bold text-green-400">{player.score}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
