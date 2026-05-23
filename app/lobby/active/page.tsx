"use client";

import { useEffect, useState } from "react";
import LobbyCard from "@/components/LobbyCard";

type Lobby = {
  id: string;
  name: string;
  players: number;
};

export default function ActiveLobbiesPage() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLobbies() {
    try {
      const res = await fetch("/api/lobby/details");
      const data = await res.json();

      setLobbies(data.lobbies);
    } catch (err) {
      console.error("Error fetching lobbies", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLobbies();

    // 🔥 auto refresh every 3 seconds (real-time feel)
    const interval = setInterval(fetchLobbies, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-6">

      <h1 className="text-3xl font-bold text-white mb-6">
        Active Lobbies 🔥
      </h1>

      {loading ? (
        <p className="text-orange-500">Loading lobbies...</p>
      ) : (
        <div className="grid gap-4">
          {lobbies.length === 0 ? (
            <p className="text-neutral-400">
              No active lobbies right now
            </p>
          ) : (
            lobbies.map((lobby) => (
              <LobbyCard key={lobby.id} lobby={lobby} />
            ))
          )}
        </div>
      )}

    </main>
  );
}