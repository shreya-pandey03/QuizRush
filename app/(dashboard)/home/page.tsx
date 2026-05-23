"use client";

import { signOut } from "next-auth/react";
import { Users, Trophy, Brain, PlusCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
   const router = useRouter(); 
  return (
    <main className="relative min-h-screen bg-[oklch(0.06_0.007_38)] overflow-hidden px-6 py-10">
      {/* Background glow */}
      <div className="absolute top-0 left-0 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-orange-600/10 blur-[140px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Multiplayer Quiz Dashboard
            </h1>

            <p className="text-neutral-400 mt-2">
              Create quiz rooms, challenge friends and climb the leaderboard
            </p>
          </div>

          <button
            onClick={() =>
              signOut({
                callbackUrl: "/signup",
              })
            }
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Stats cards */}

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <Users className="text-orange-500 mb-4" size={30} />
            <h2 className="text-white font-semibold text-xl">Active Rooms</h2>
            <p className="text-neutral-400 mt-2">
              Join live multiplayer quiz rooms
            </p>
          </div>

          <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <Brain className="text-orange-500 mb-4" size={30} />
            <h2 className="text-white font-semibold text-xl">Quiz Battles</h2>
            <p className="text-neutral-400 mt-2">
              Test your knowledge with friends
            </p>
          </div>

          <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <Trophy className="text-orange-500 mb-4" size={30} />
            <h2 className="text-white font-semibold text-xl">Rankings</h2>
            <p className="text-neutral-400 mt-2">
              Rise on the global leaderboard
            </p>
          </div>
        </div>

        {/* Action section */}

        <div className="mt-12 rounded-3xl bg-[oklch(0.09_0.007_38)] border border-white/[0.08] p-8">
          <h2 className="text-2xl font-bold text-white">Ready to Play?</h2>

          <p className="text-neutral-400 mt-2">
            Start a new room or join an existing challenge.
          </p>

     <div className="flex gap-4 mt-6">
    
    <button
      onClick={() => router.push("/create-room")}
      className="flex items-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-semibold transition"
    >
      <PlusCircle size={18} />
      Create Room
    </button>

    <button
      onClick={() => router.push("/join-room")}
      className="px-6 py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
    >
      Join Room
    </button>

  </div>
        </div>
      </div>
    </main>
  );
}
