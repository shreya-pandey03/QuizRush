"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket/socket";

export default function LobbyPage() {
  const [lobbies, setLobbies] = useState<any[]>([]);

  //active lobbies
  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      console.log("CONNECTED:", socket.id);
      socket.emit("request-active-lobbies");
    };

    const onLobbies = (data: any) => {
      console.log("ACTIVE LOBBIES RECEIVED:", data);
      setLobbies(data);
    };

    socket.on("connect", onConnect);
    socket.on("activeLobbiesUpdated", onLobbies);

    return () => {
      socket.off("connect", onConnect);
      socket.off("activeLobbiesUpdated", onLobbies);
    };
  }, []);

  return (
    <main className="min-h-screen p-6 bg-[#0a0a0a] text-white">
      <h1 className="text-[#ea781e] text-2xl mb-6">Live Lobbies</h1>

      {lobbies.length === 0 ? (
        <p className="text-gray-400">No lobbies yet</p>
      ) : (
        lobbies.map((lobby) => (
          <div
            key={lobby.id}
            className="p-4 mb-3 border border-orange-500/20 rounded-xl"
          >
            {/* <p>Lobby ID: {lobby.id}</p> */}
            <p>Host: {lobby.hostName}</p>
            <p>Players: {lobby.playerCount}</p>
            <p>Lobby Code: {lobby.code}</p>
            <p>Status: {lobby.status}</p>
          </div>
        ))
      )}
    </main>
  );
}
