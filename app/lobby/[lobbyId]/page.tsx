"use client";

import { useParams, useRouter } from "next/navigation";

import { Users, Copy, Play, Check, Crown } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";

import QuizLobbyClient from "./QuizLobbyClient";

type Player = {
  id: string;
  name: string;
};

export default function LobbyRoomPage() {
  const params = useParams();

  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);

  const [quizStarted, setQuizStarted] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const lobbyId = Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : (params.lobbyId?.toString() ?? "");

  // User ID

  const [userId, setUserId] = useState("");

  useEffect(() => {
    let guestId = localStorage.getItem("guestId");

    if (!guestId) {
      guestId = crypto.randomUUID();

      localStorage.setItem("guestId", guestId);
    }

    setUserId(guestId);
  }, []);

  // Socket Connection

  useEffect(() => {
    if (!lobbyId || !userId) return;

    socketRef.current = io("http://localhost:3002");

    const socket = socketRef.current;

    // Join Room

    socket.emit("joinRoom", {
      roomId: lobbyId,
      userId,
    });

    // Add Player

    socket.emit("playerJoined", {
      roomId: lobbyId,
      player: {
        id: userId,
        name: userId.slice(0, 6),
      },
    });

    // Receive Players

    socket.on("playersUpdated", (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    // Quiz Started

    socket.on("quizStarted", () => {
      setQuizStarted(true);

      router.push(`/quiz/${lobbyId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [lobbyId, userId, router]);

  // Copy Lobby ID

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

  // Start Quiz

  function startQuiz() {
    if (!socketRef.current || !lobbyId) return;

    socketRef.current.emit("startQuiz", lobbyId);
  }

  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Lobby Client */}

        <QuizLobbyClient lobbyId={lobbyId} />

        {/* Main Card */}

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          {/* Heading */}

          <h1 className="text-4xl font-bold text-white">Quiz Lobby 🎮</h1>

          <p className="text-neutral-400 mt-2">
            Waiting for players to join...
          </p>

          {/* Room ID */}

          <div className="mt-8 p-5 rounded-2xl bg-black border border-white/10">
            <p className="text-neutral-400">Lobby Code</p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-orange-500 font-bold text-2xl tracking-widest">
                {lobbyId}
              </span>

              <button
                onClick={copyRoomId}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-white flex items-center gap-2 transition"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
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

          {/* Players */}

          <div className="mt-10">
            <h2 className="text-white text-2xl font-semibold flex items-center gap-2">
              <Users size={22} />
              Players ({players.length})
            </h2>

            <div className="space-y-4 mt-5">
              {players.length === 0 ? (
                <div className="bg-black border border-white/10 rounded-xl p-4 text-neutral-400">
                  Waiting for players...
                </div>
              ) : (
                players.map((player, index) => (
                  <div
                    key={player.id}
                    className="bg-black border border-white/10 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                        {player.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-white font-medium">{player.name}</p>

                        <p className="text-neutral-400 text-sm">Player</p>
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Crown size={18} />
                        Host
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Start Quiz Button */}

          <button
            onClick={startQuiz}
            disabled={players.length < 1 || quizStarted}
            className="mt-10 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition"
          >
            <Play size={18} />

            {quizStarted ? "Starting Quiz..." : "Start Quiz"}
          </button>
        </div>
      </div>
    </main>
  );
}
