"use client";

import { useParams, useRouter } from "next/navigation";
import { Users, Copy, Play, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function LobbyRoomPage() {
  const params = useParams();
  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const lobbyId = Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : String(params.lobbyId);

  useEffect(() => {
    socketRef.current = io("http://localhost:3002");

    const socket = socketRef.current;

    if (lobbyId) {
      socket.emit("joinRoom", lobbyId);

      console.log("Joined room:", lobbyId);
    }

    return () => {
      socket.disconnect();
    };
  }, [lobbyId]);

  async function copyRoomId() {
    if (!lobbyId) return;

    try {
      await navigator.clipboard.writeText(lobbyId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  function startQuiz() {
    if (!lobbyId || !socketRef.current) {
      return;
    }

    socketRef.current.emit("startQuiz", lobbyId);

    router.push(`/quiz/${lobbyId}`);
  }

  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          <h1 className="text-4xl font-bold text-white">Quiz Lobby 🎮</h1>

          <p className="text-neutral-400 mt-2">
            Waiting for players to join...
          </p>

          <div className="mt-8 p-5 rounded-xl bg-black border border-white/10">
            <p className="text-neutral-400">Room ID</p>

            <div className="flex items-center justify-between mt-2">
              <span className="text-orange-500 font-bold text-lg">
                {lobbyId}
              </span>

              <button
                onClick={copyRoomId}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-white text-xl font-semibold flex items-center gap-2">
              <Users size={20} />
              Players
            </h2>

            <div className="space-y-3 mt-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white">
                Host (You)
              </div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="mt-8 w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
          >
            <Play size={18} />
            Start Quiz
          </button>
        </div>
      </div>
    </main>
  );
}
