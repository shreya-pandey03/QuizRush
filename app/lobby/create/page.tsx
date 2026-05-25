"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLobbyPage() {
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();


  async function createLobby() {
    if (!name.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/lobby/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,

          hostId: "host123",
        }),
      });

      const data = await res.json();

      alert(`Room Code: ${data.roomCode}`);

      router.push(`/lobby/${data.lobbyId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white/[0.03] border border-white/10">
        <h1 className="text-3xl font-bold text-white text-center">
          Create Lobby
        </h1>

        <p className="text-neutral-400 text-center mt-2">
          Create your multiplayer quiz room
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Lobby name"
          className="w-full mt-6 p-3 rounded-xl bg-black border border-white/10 text-white"
        />

        <button
          onClick={createLobby}
          disabled={loading}
          className="w-full mt-5 bg-orange-500 hover:bg-orange-600 py-4 rounded-xl text-white font-semibold"
        >
          {loading ? "Creating..." : "Create Lobby"}
        </button>
      </div>
    </main>
  );
}
