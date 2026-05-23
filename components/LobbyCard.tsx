"use client";

import { useRouter } from "next/navigation";

export default function LobbyCard({ lobby }: any) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/lobby/${lobby.id}`)}
      className="cursor-pointer p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500 transition"
    >
      <h2 className="text-white font-bold">
        {lobby.name}
      </h2>

      <p className="text-neutral-400 mt-1">
        {lobby.players} players inside
      </p>

      <p className="text-orange-500 text-sm mt-2">
        Click to join →
      </p>
    </div>
  );
}