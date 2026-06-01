import { useEffect } from "react";
import { socket } from "@/lib/socket/client";

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
  useEffect(() => {
    if (!lobbyId || !userId || userId.trim() === "") return;

    const { setPlayers } = useLobbyStore.getState();
    const { setTimeLeft } = useTimerStore.getState();
    const { setQuestion } = useQuizStore.getState();
    const { setLeaderboard } =
      useLeaderboardStore.getState();

    // connect only once
    if (!socket.connected) {
      socket.connect();
    }

    console.log("JOIN EMIT", {
      lobbyId,
      userId,
      playerName,
    });

 socket.emit("join-lobby", {
  lobbyId,
  player: {
    id: userId,
    name: playerName ?? "Player",
  },
});

    // cleanup previous listeners first
    socket.off("players-update");
    socket.off("timer-update");
    socket.off("quiz-started");
    socket.off("next-question");
    socket.off("leaderboard-update");

    socket.on("players-update", (players) => {
      console.log("PLAYERS UPDATE RECEIVED", players);
      setPlayers(players);
    });

    socket.on("timer-update", setTimeLeft);
    socket.on("quiz-started", setQuestion);
    socket.on("next-question", setQuestion);
    socket.on("leaderboard-update", setLeaderboard);

    socket.on("quiz-ended", (results) => {
      console.log("Results:", results);
    });

    return () => {
      socket.off("players-update");
      socket.off("timer-update");
      socket.off("quiz-started");
      socket.off("next-question");
      socket.off("leaderboard-update");
      socket.disconnect();
    };
  }, [lobbyId, userId, playerName]);
}