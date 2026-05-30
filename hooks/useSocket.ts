import { useEffect } from "react";
import { io } from "socket.io-client";
import { useLobbyStore } from "@/store/lobbyStore";

import { useTimerStore } from "@/store/timerStore";

import { useQuizStore } from "@/store/quizStore";
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
    if (!lobbyId || !userId) return;

    const socket = io("http://localhost:3002");
    const { setPlayers } = useLobbyStore.getState();

    const { setTimeLeft } = useTimerStore.getState();

    const { setQuestion } = useQuizStore.getState();

    socket.emit("join-lobby", {
      lobbyId,

      player: {
        id: userId,

        name: playerName ?? "Player",
      },
    });

    socket.on("players-update", setPlayers);

    socket.on("timer-update", setTimeLeft);

    socket.on("quiz-started", setQuestion);

    socket.on("next-question", setQuestion);

    socket.on("leaderboard-update", (leaderboard) => {
      console.log("Leaderboard:", leaderboard);
    });

    socket.on("quiz-ended", (results) => {
      console.log("Results:", results);
    });

    return () => {
      socket.disconnect();
    };
  }, [lobbyId, userId, playerName]);
}
