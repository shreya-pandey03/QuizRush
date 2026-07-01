"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  lobbyId?: string;
};

export default function HomeButtons({
  lobbyId,
}: Props) {
  const router = useRouter();

  // Rejoin button
  if (lobbyId) {
    return (
      <button
        onClick={() =>
          router.push(`/lobby/${lobbyId}`)
        }
        className="
        mt-3
        bg-orange-500
        hover:bg-orange-600
        px-4
        py-2
        rounded-lg
        text-white
        transition
        "
      >
        Rejoin Lobby
      </button>
    );
  }

  // Main dashboard buttons
  return (
    <div className="flex gap-4">

      <button
        onClick={() =>
          router.push("/lobby/create")
        }
        className="
        flex
        items-center
        gap-2
        bg-orange-500
        hover:bg-orange-600
        px-6
        py-4
        rounded-xl
        text-white
        font-semibold
        transition
        "
      >
        <Play size={18} />
        Create Lobby
      </button>

      <button
        onClick={() =>
          router.push("/lobby/join")
        }
        className="
        px-6
        py-4
        rounded-xl
        border
        border-white/10
        text-white
        hover:bg-white/5
        transition
        "
      >
        Quick Join
      </button>

    </div>
  );
}