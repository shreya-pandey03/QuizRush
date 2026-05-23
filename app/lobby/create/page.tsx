"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLobbyPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createLobby() {
    if (!name.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/lobby/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          hostId: "host123", // later replace with session user
        }),
      });

      const data = await res.json();

      // IMPORTANT: API must return lobbyId
      router.push(`/lobby/${data.lobbyId}`);

    } catch (err) {
      console.error("Failed to create lobby:", err);
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
          Enter lobby name to start quiz room
        </p>

        <input
          className="w-full mt-6 p-3 rounded-xl bg-black border border-white/10 text-white"
          placeholder="Lobby name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={createLobby}
          disabled={loading}
          className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Creating..." : "Create Lobby"}
        </button>

      </div>

    </main>
  );
}