"use client";

import { useParams, useRouter } from "next/navigation";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();

  const lobbyId = params.lobbyId as string;

  return (
    <div>
      <h1>Results for {lobbyId}</h1>

      <button
        onClick={() => router.push(`/lobby/${lobbyId}`)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "9px 20px",
          borderRadius: 8,
          background: "#0d0d0d",
          border: "1px solid rgba(234,120,30,.3)",
          color: "#ea781e",
          fontSize: 13,
          fontFamily: "Georgia, serif",
          cursor: "pointer",
          marginTop: "16px",
        }}
      >
        View Leaderboard
      </button>
    </div>
  );
}