"use client";

import { Trophy } from "lucide-react";

export default function LeaderboardPage() {

  const players = [
    {name:"Alex",score:980},
    {name:"John",score:820},
    {name:"Sarah",score:700},
    {name:"David",score:630},
  ];

  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">

      <div className="flex items-center gap-3">

        <Trophy
          className="text-orange-500"
          size={35}
        />

        <h1 className="text-4xl font-bold text-white">
          Leaderboard
        </h1>

      </div>

      <div className="mt-8 space-y-4">

        {players.map((player,index)=>(

          <div
            key={index}
            className="bg-white/[0.03] border border-white/10 p-5 rounded-xl flex justify-between items-center"
          >

            <div>

              <h2 className="text-white font-semibold">
                #{index+1} {player.name}
              </h2>

            </div>

            <div className="text-orange-500 font-bold">
              {player.score} pts
            </div>

          </div>

        ))}

      </div>

    </main>
  );
}