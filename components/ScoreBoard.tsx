type PlayerScore = {
  id: string;
  name: string;
  score: number;
};

export default function ScoreBoard({
  leaderboard,
}: {
  leaderboard?: PlayerScore[];
}) {
  const safeLeaderboard = leaderboard ?? [];

  return (
   <div className="w-full max-w-md mx-auto p-6 bg-gray-800 shadow-lg rounded-2xl">
     <h2 className="text-2xl font-bold text-center mb-4"> Leaderboard</h2>

      {safeLeaderboard.length === 0 ? (
        <p className="text-gray-500">No scores yet...</p>
      ) : (
        <div className="space-y-2">
          {safeLeaderboard.map((p, index) => (
            <div
              key={p.id}
              className="flex justify-between p-2 border rounded"
            >
              <span>
                {index + 1}. {p.name}
              </span>
              <span className="font-bold">{p.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
