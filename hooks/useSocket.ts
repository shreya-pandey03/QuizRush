import { useEffect } from "react";
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
useEffect(() => {
  if (!lobbyId || !userId) return;

  const setPlayers = useLobbyStore.getState().setPlayers;
  const setTimeLeft = useTimerStore.getState().setTimeLeft;
  const setQuestion = useQuizStore.getState().setQuestion;
  const setLeaderboard = useLeaderboardStore.getState().setLeaderboard;

  socket.connect();

  socket.on("connect", () => {
    socket.emit("join-lobby", {
      lobbyId,
      player: {
        id: userId,
        name: playerName ?? "Player",
      },
    });
  });

  socket.on("players-update", (players) => {
    setPlayers(players);
    setLeaderboard(players);
  });

  socket.on("timer-update", setTimeLeft);
  socket.on("quiz-started", setQuestion);
  socket.on("next-question", setQuestion);
  socket.on("leaderboard-update", setLeaderboard);

  return () => {
    socket.disconnect();
  };
}, [lobbyId, userId, playerName]);
}
