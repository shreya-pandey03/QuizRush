"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Brain, Trophy, Users, ArrowRight, LogOut } from "lucide-react";

export default function SignUpPage() {
  const { data: session } = useSession();

  return (
    <main className="relative min-h-screen bg-[oklch(0.06_0.007_38)] flex items-center justify-center overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] bg-orange-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-orange-600/10 rounded-full blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-[oklch(0.09_0.007_38)]/80 backdrop-blur-xl border border-white/[0.08] p-8 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          {session ? (
            <div className="flex flex-col items-center">
             {session.user?.image ? (
  <img
    src={session.user.image}
    alt="profile"
    className="w-24 h-24 rounded-full border-4 border-orange-500"
  />
) : (
  <div className="w-24 h-24 rounded-full border-4 border-orange-500 flex items-center justify-center">
    👤
  </div>
)}

              <h1 className="text-white text-2xl font-bold mt-5">
                Welcome Back
              </h1>

              <p className="text-orange-400 mt-2 font-medium">
                {session.user?.name}
              </p>

              <p className="text-neutral-400 text-sm">{session.user?.email}</p>

              <button
                onClick={() =>
                  signOut({
                    callbackUrl: "/signup",
                  })
                }
                className="mt-6 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-2 transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-center text-white text-3xl font-bold">
                Multiplayer Quiz Game
              </h1>

              <p className="text-center text-neutral-400 mt-3">
                Join rooms, play real-time quizzes and compete with players
                worldwide
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.08] flex flex-col items-center">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span className="text-white text-xs mt-2">Rooms</span>
                </div>

                <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.08] flex flex-col items-center">
                  <Brain className="w-5 h-5 text-orange-500" />
                  <span className="text-white text-xs mt-2">Quiz</span>
                </div>

                <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.08] flex flex-col items-center">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span className="text-white text-xs mt-2">Ranking</span>
                </div>
              </div>

              <button
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/home",
                  })
                }
                className="w-full mt-8 bg-orange-500 hover:bg-orange-600 rounded-xl py-4 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
              >
                Continue with Google
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
