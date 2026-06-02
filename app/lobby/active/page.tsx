"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket/socket";

interface Lobby {
  id: string;
  name: string;
  code: string;
  hostId: string;
  isStarted: boolean;
}

export default function ActiveLobbiesPage() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
   if (!socket.connected) {
    socket.connect();
  }


  const handleLobbiesUpdated = (data: Lobby[]) => {
    setLobbies(data);
    setLoading(false);
  };

  const handleError = (error: Error) => {
    console.error("Socket error:", error);
    setLoading(false);
  };

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on(
    "activeLobbiesUpdated",
    handleLobbiesUpdated
  );

  socket.on(
    "connect_error",
    handleError
  );

  return () => {
    socket.off(
      "activeLobbiesUpdated",
      handleLobbiesUpdated
    );

    socket.off(
      "connect_error",
      handleError
    );
  };
}, []);

  return (
    <main className="min-h-screen p-6 bg-[oklch(0.06_0.007_38)] text-white">
      <h1 className="text-3xl font-bold">
        Active Lobbies
      </h1>

      {loading ? (
        <div className="mt-6 text-neutral-400">
          Loading...
        </div>
      ) : lobbies.length === 0 ? (
        <div className="mt-6 text-neutral-400">
          No Active Lobbies
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {lobbies.map((lobby) => (
            <div
              key={lobby.id}
              className="
                rounded-xl
                bg-white/5
                border
                border-white/10
                p-4
                hover:border-orange-500/40
                transition
              "
            >
              <h2 className="text-xl font-semibold">
                {lobby.name}
              </h2>

              <p className="text-orange-500 mt-1">
                Code: {lobby.code}
              </p>

              <p className="text-sm text-neutral-400 mt-2">
                Status: {
                  lobby.isStarted
                    ? "Started"
                    : "Waiting"
                }
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}