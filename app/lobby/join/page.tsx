 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinLobbyPage() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  function joinLobby() {
    const code = roomCode.trim();

    if (!code) return;

    router.push(`/lobby/${code}`);
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">

        <h1 className="text-3xl font-bold text-white">
          Join Quiz Room 🎮
        </h1>

        <p className="mt-2 text-neutral-400">
          Enter room code shared by host
        </p>

        <input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter room code"
          className="w-full mt-6 p-3 rounded-lg bg-black border border-white/10 text-white outline-none"
        />

        <button
          onClick={joinLobby}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
        >
          Join Room
        </button>

      </div>
    </main>
  );
}