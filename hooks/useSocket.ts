"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket/socket";
import { useLobbyStore } from "@/store/lobbyStore";
import { useTimerStore } from "@/store/timerStore";
import { useQuizStore } from "@/store/quizStore";
import { useLeaderboardStore } from "@/store/leaderboardStore";

interface SocketProps {
  lobbyId: string;
  userId?: string;
  playerName?: string;
}

export default function useSocket({
  lobbyId,
  userId,
  playerName,
}: SocketProps) {
  const router = useRouter();

  useEffect(() => {
    if (!lobbyId || !userId) return;

    const setPlayersFromLobby = useLobbyStore.getState().setPlayersFromLobby;
    const setQuestions = useQuizStore.getState().setQuestions;
    const setQuestion = useQuizStore.getState().setQuestion;
    const setLeaderboard = useLeaderboardStore.getState().setLeaderboard;
    const setTimeLeft = useTimerStore.getState().setTimeLeft;

    const handleConnect = () => {
      console.log("CONNECTED:", socket.id);

      console.log("JOINED ROOM:", socket.id, lobbyId);

      socket.emit("join-lobby", {
        lobbyId,
        player: {
          id: userId,
          name: playerName ?? "Player",
        },
      });
    };

    const handleDisconnect = (reason: string) => {
      console.log("DISCONNECTED:", reason);
    };

    socket.connect();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("players-update", (players) => {
      console.log("PLAYERS UPDATE", players);

      setPlayersFromLobby(players);
      setLeaderboard(players);
    });

    socket.on("timer-update", (timeLeft) => {
      setTimeLeft(timeLeft);
    });

    socket.on("quiz-started", (questions) => {
      setQuestions(questions);
    });

    socket.on("next-question", (question) => {
      setQuestion(question);
    });
    
    socket.on("leaderboard-update", (players) => {
      console.log("LEADERBOARD UPDATE RECEIVED", players);

      setLeaderboard(players);
    });

    socket.on("answer-result", (data) => {
      console.log("ANSWER RESULT", data);
    });
    // Listen for quiz end event
    socket.on("quiz-ended", (data) => {
      useLeaderboardStore.getState().setLeaderboard(data.leaderboard);

      useQuizStore.getState().setFinished(true);

      //  RESET OLD STATE
      // useQuizStore.getState().setQuestions([]);
      // useQuizStore.getState().setQuestion(null as any);

      useLobbyStore.getState().setPlayers([]);

      // router.push("/quiz/results");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("players-update");
      socket.off("timer-update");
      socket.off("quiz-started");
      socket.off("next-question");
      socket.off("leaderboard-update");
      socket.off("quiz-ended");

      socket.disconnect();
    };
  }, [lobbyId, userId, playerName, router]);
}
