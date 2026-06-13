"use client";

import { useSession } from "next-auth/react";
import useSocket from "@/hooks/useSocket";
import PlayersList from "@/components/PlayersList";
import QuestionCard from "@/components/QuestionCard";
import ScoreBoard from "@/components/ScoreBoard";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket/socket";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { useLeaderboardStore } from "@/store/leaderboardStore";

interface Props {
  lobbyId: string;
}

export default function QuizLobbyClient({ lobbyId }: Props) {
  const { data: session, status } = useSession();

  const userId = session?.user?.email ?? "";
  const router = useRouter();
  const finished = useQuizStore((s) => s.finished);
  // LOCAL STATE
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);

  const leaderboard = useLeaderboardStore((state) => state.leaderboard);

  console.log("LEADERBOARD STORE:", leaderboard);

  const [quizStarted] = useState(false);

  // Redirect to result page when quiz is finished
  useEffect(() => {
    if (finished) {
      router.replace(`/quiz/${lobbyId}/results`);
    }
  }, [finished, lobbyId, router]);

  // Socket connection
  useSocket({
    lobbyId,
    userId: status === "authenticated" ? userId : "",
    playerName:
      status === "authenticated" ? (session?.user?.name ?? "Player") : "",
  });

  // Reset handler
  useEffect(() => {
    const handleReset = () => {
      setQuestions([]);
      setCurrentQuestion(0);
      setAnswers([]);
    };

    socket.off("quiz-reset", handleReset); // prevent duplicates
    socket.on("quiz-reset", handleReset); // Listen for quiz reset events

    return () => {
      socket.off("quiz-reset", handleReset); // Clean up the event listener on unmount
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
      {!quizStarted ? (
        <>
          <PlayersList />
          <ScoreBoard leaderboard={leaderboard} />
        </>
      ) : (
        <QuestionCard lobbyId={lobbyId} />
      )}
    </div>
  );
}
