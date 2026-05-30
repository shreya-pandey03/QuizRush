"use client";

import { useSession } from "next-auth/react";
import useSocket from "@/hooks/useSocket";
import PlayersList from "@/components/PlayersList";
import QuestionCard from "@/components/QuestionCard";
import QuizTimer from "@/components/QuizTimer";

interface Props {
  lobbyId: string;
}

export default function QuizLobbyClient({ lobbyId }: Props) {
  const { data: session, status } = useSession();

  const userId = (session?.user as { id?: string })?.id;

  // Connect socket only when both values exist
  useSocket({
    lobbyId,

    userId,

    playerName: session?.user?.name ?? "Player",
  });

  if (status === "loading") {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (!session?.user) {
    return <div className="p-6 text-red-500">User not found</div>;
  }

  if (!lobbyId) {
    return <div className="p-6 text-red-500">Invalid lobby</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white">Lobby: {lobbyId}</h1>

      <p className="mt-2 text-neutral-400">
        Player: {session.user.name ?? "Unknown"}
      </p>

      <div className="mt-6 space-y-6">
        <PlayersList />

        <QuizTimer />

        <QuestionCard />
      </div>
    </div>
  );
}
