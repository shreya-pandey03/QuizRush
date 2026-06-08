"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ScoreBoard from "@/components/ScoreBoard";

const socket = io("http://localhost:3001");

type PlayerScore = {
  playerId: string;
  name: string;
  score: number;
};

export default function ResultPage() {
  const [results, setResults] = useState<PlayerScore[]>([]);

  useEffect(() => {
    socket.on("game:finished", (data: PlayerScore[]) => {
      setResults(data);
    });

    socket.on("leaderboard:update", (data: PlayerScore[]) => {
      setResults(data);
    });

    return () => {
      socket.off("game:finished");
      socket.off("leaderboard:update");
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <ScoreBoard leaderboard={results} />
    </div>
  );
}