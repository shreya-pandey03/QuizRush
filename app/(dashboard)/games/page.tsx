"use client";

import { useRouter } from "next/navigation";
import { Clock, Trophy, ArrowRight } from "lucide-react";

export default function GamesPage() {
  const router = useRouter();

  const games = [
    {
      id: "1",
      title: "Science Quiz Battle",
      score: 85,
      date: "24 May 2026",
      status: "Won",
    },
    {
      id: "2",
      title: "General Knowledge",
      score: 72,
      date: "23 May 2026",
      status: "Lost",
    },
    {
      id: "3",
      title: "Sports Challenge",
      score: 95,
      date: "22 May 2026",
      status: "Won",
    },
  ];

  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Match History
        </h1>

        <p className="text-neutral-400 mt-2">
          Review your previous quiz matches and scores
        </p>
      </div>

      <div className="space-y-5">

        {games.map((game) => (

          <div
            key={game.id}
            onClick={() => router.push(`/games/${game.id}`)}
            className="cursor-pointer bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-orange-500 transition-all duration-300"
          >

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-white text-xl font-semibold">
                  {game.title}
                </h2>

                <div className="flex items-center gap-2 mt-3 text-neutral-400">

                  <Clock size={16}/>

                  <span>{game.date}</span>

                </div>

              </div>

              <ArrowRight
                className="text-orange-500"
                size={22}
              />

            </div>

            <div className="mt-5 flex justify-between items-center">

              <div className="flex items-center gap-2">

                <Trophy
                  className="text-orange-500"
                  size={18}
                />

                <span className="text-white font-medium">
                  {game.score} pts
                </span>

              </div>

              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold
                ${
                  game.status === "Won"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {game.status}
              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}