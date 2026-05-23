export default function Leaderboard() {
  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">

      <h1 className="text-3xl font-bold text-orange-500">
        Global Leaderboard
      </h1>

      <div className="mt-8 space-y-3">

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10"
          >
            <span>Player {i}</span>
            <span className="text-orange-500 font-bold">
              {100 - i * 10} pts
            </span>
          </div>
        ))}

      </div>

    </main>
  );
}