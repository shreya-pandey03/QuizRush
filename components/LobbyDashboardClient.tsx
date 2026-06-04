"use client";

import PlayersList from "./PlayersList";
import QuizTimer from "./QuizTimer";
import { Users } from "lucide-react";

interface Props {
  lobbyId: string;
}

export default function LobbyDashboardClient({
  lobbyId,
}: Props) {
  return (
    <div className="space-y-6">

      {/* Lobby Header */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Users
            size={22}
            className="text-orange-500"
          />

          <h2 className="text-white text-xl font-semibold">
            Lobby Dashboard
          </h2>
        </div>

        <p className="text-neutral-400 mt-2">
          Waiting for players to join...
        </p>

        <p className="text-orange-500 mt-3 font-medium">
          Room Code: {lobbyId}
        </p>
      </div>

      {/* Players */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <PlayersList  />
      </div>

      {/* Timer */}


    </div>
  );
}