"use client";

import { useSession } from "next-auth/react";
import useSocket from "@/hooks/useSocket";
import PlayersList from "@/components/PlayersList";
import QuestionCard from "@/components/QuestionCard";
import QuizTimer from "@/components/QuizTimer";

import ScoreBoard from "@/components/ScoreBoard";

interface Props {
  lobbyId: string;
}

export default function QuizLobbyClient({ lobbyId }: Props) {
  const { data: session, status } = useSession();

  // console.log("EMAIL RAW:", session?.user?.email);
  // console.log("EMAIL LENGTH:", session?.user?.email?.length);
  // console.log("EMAIL JSON:", JSON.stringify(session?.user?.email));
  // console.log(session?.user?.email?.split(""));
  // console.log([...(session?.user?.email ?? "")]);

  const userId = session?.user?.email ?? "";

  // Connect socket only when both values exist
  useSocket({
    lobbyId,
    userId: status === "authenticated" ? userId : "",
    playerName:
      status === "authenticated" ? (session?.user?.name ?? "Player") : "",
  });

  console.log("Lobby ID:", lobbyId);
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

        <QuestionCard lobbyId={lobbyId} />

        <ScoreBoard />
      </div>
    </div>
  );
}
