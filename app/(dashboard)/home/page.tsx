"use client";

import {
  Trophy,
  Gamepad2,
  Users,
  Play
} from "lucide-react";

import { useRouter } from "next/navigation";

import JoinLobbyDialog from "@/components/JoinLobbyDialog";

export default function HomePage() {

  const router = useRouter();

  return (

    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">

      <h1 className="text-4xl font-bold text-white">

        Multiplayer Quiz Dashboard

      </h1>

      <p className="mt-2 text-neutral-400">

        Create rooms, challenge players and dominate the leaderboard.

      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">

          <Users
          className="text-orange-500"
          size={30}
          />

          <h2 className="text-white text-xl mt-4 font-semibold">

            Active Lobbies

          </h2>

          <p className="text-neutral-400 mt-2">

            12 rooms running

          </p>

        </div>

        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">

          <Gamepad2
          className="text-orange-500"
          size={30}
          />

          <h2 className="text-white text-xl mt-4 font-semibold">

            Games Played

          </h2>

          <p className="text-neutral-400 mt-2">

            24 matches

          </p>

        </div>

        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">

          <Trophy
          className="text-orange-500"
          size={30}
          />

          <h2 className="text-white text-xl mt-4 font-semibold">

            Wins

          </h2>

          <p className="text-neutral-400 mt-2">

            10 victories

          </p>

        </div>

      </div>

      <div className="flex gap-4 mt-10">

        <button
          onClick={() =>
            router.push(
              "/lobby/create"
            )
          }
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-xl text-white font-semibold"
        >

          <Play size={18}/>

          Create Lobby

        </button>

      </div>

      <div className="mt-10">

        <JoinLobbyDialog />

      </div>

    </main>

  );

}