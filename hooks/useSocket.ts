"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket/socket";
import { useQuizStore } from "@/store/quizStore";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { useSession } from "next-auth/react";

export default function useSocket({
  lobbyId,
  userId,
  playerName,
}: {
  lobbyId: string;
  userId?: string;
  playerName?: string;
}) {
  const router = useRouter();
  const joinedRef = useRef(false);

  const { data: session } = useSession();

  const setQuestions = useQuizStore((s) => s.setQuestions);
  const setFinished = useQuizStore((s) => s.setFinished);
  const setLeaderboard = useLeaderboardStore((s) => s.setLeaderboard);

  // JOIN / REJOIN

  useEffect(() => {
    if (!lobbyId || !userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const joinLobby = () => {
      const payload = {
        lobbyId,
        player: {
          id: userId,
          name: playerName ?? "Player",
          photo: session?.user?.image ?? null,
        },
      };

      console.log("JOIN PAYLOAD:", payload);

      socket.emit("join-lobby", payload);
      joinedRef.current = true;
    };

    joinLobby();

    const handleReconnect = () => {
      console.log("RECONNECTING...");
      socket.emit("rejoin-lobby", {
        lobbyId,
        playerId: userId,
      });
    };

    socket.on("connect", handleReconnect);

    // QUIZ STARTED

    const handleQuizStarted = (data: any) => {
      if (!data?.questions?.length) return;

      localStorage.removeItem(`quiz-${lobbyId}`);
      localStorage.removeItem(`review-${lobbyId}`);
      localStorage.removeItem(`quiz-results-${lobbyId}`);

      setQuestions(data.questions);
      setFinished(false);

      router.push(`/quiz/${lobbyId}`);
    };

    socket.on("quiz-started", handleQuizStarted);

    // QUIZ ENDED

    const handleQuizEnded = (data: any) => {
      const leaderboard = data?.leaderboard ?? [];
      setLeaderboard(leaderboard);

      setFinished(true);
      router.push(`/quiz/${lobbyId}/results`);
    };

    socket.on("quiz-ended", handleQuizEnded);

    return () => {
      socket.off("connect", handleReconnect);
      socket.off("quiz-started", handleQuizStarted);
      socket.off("quiz-ended", handleQuizEnded);
    };
  }, [
    lobbyId,
    userId,
    playerName,
    router,
    session?.user?.image,
    setFinished,
    setLeaderboard,
    setQuestions,
  ]);
}
