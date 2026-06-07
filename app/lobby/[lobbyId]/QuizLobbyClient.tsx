"use client";

import { useSession } from "next-auth/react";
import useSocket from "@/hooks/useSocket";
import PlayersList from "@/components/PlayersList";
import QuestionCard from "@/components/QuestionCard";
// import QuizTimer from "@/components/QuizTimer";
import ScoreBoard from "@/components/ScoreBoard";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket/socket";

interface Props {
  lobbyId: string;
}

export default function QuizLobbyClient({ lobbyId }: Props) {
  const { data: session, status } = useSession();

  const userId = session?.user?.email ?? "";

  // LOCAL STATE
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);

  // Socket connection
  useSocket({
    lobbyId,
    userId: status === "authenticated" ? userId : "",
    playerName:
      status === "authenticated"
        ? (session?.user?.name ?? "Player")
        : "",
  });

  // Reset handler
  useEffect(() => {
    const handleReset = () => {
      setQuestions([]);
      setCurrentQuestion(0);
      setAnswers([]);
    };

    socket.on("quiz-reset", handleReset);

    return () => {
      socket.off("quiz-reset", handleReset);
    };
  }, []);

  // Loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!session?.user) {
    return <div>User not found</div>;
  }

  // Invalid lobby
  if (!lobbyId) {
    return <div>Invalid lobby</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <PlayersList />
      {/* <QuizTimer /> */}
      <ScoreBoard />
      <QuestionCard lobbyId={lobbyId} />
    </div>
  );
}