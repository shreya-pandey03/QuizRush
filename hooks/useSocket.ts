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
  console.log({ lobbyId, userId, playerName });

  useEffect(() => {
    console.log("SOCKET EFFECT FIRED");

    if (!lobbyId || !userId?.trim()) return;

    const { setPlayers } = useLobbyStore.getState();
    const { setTimeLeft } = useTimerStore.getState();
    const { setQuestion } = useQuizStore.getState();
    const { setLeaderboard } = useLeaderboardStore.getState();

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("SOCKET DISCONNECTED", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("CONNECT ERROR", err);
    });


    console.log("JOIN USER ID:", userId);
console.log("PLAYER NAME:", playerName);

    socket.emit("join-lobby", {
      lobbyId,
      player: {
        id: userId,
        name: playerName ?? "Player",
      },
    });

    // const handlePlayersUpdate = (players: any) => {
    //   console.log("PLAYERS UPDATE RECEIVED", players);
    //   setPlayers(players);
    // };

    const handlePlayersUpdate = (players: any) => {
      console.count("PLAYERS_UPDATE_EVENT");
      setPlayers(players);
    };
    socket.on("players-update", (players) => {
      setPlayers(players);

      setLeaderboard(players);
    });
    socket.on("timer-update", setTimeLeft);
    socket.on("quiz-started", setQuestion);
    socket.on("next-question", setQuestion);
    socket.on("leaderboard-update", setLeaderboard);

    return () => {
      console.log("SOCKET EFFECT CLEANUP");

      socket.off("players-update", handlePlayersUpdate);
      socket.off("timer-update", setTimeLeft);
      socket.off("quiz-started", setQuestion);
      socket.off("next-question", setQuestion);
      socket.off("leaderboard-update", setLeaderboard);
    };
  }, [lobbyId, userId, playerName]);
}
