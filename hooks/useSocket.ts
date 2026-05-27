import { useEffect } from "react";
import { io } from "socket.io-client";

interface SocketProps {
  lobbyId: string;
  userId?: string;
}

export default function useSocket({
  lobbyId,
  userId,
}: SocketProps) {
  useEffect(() => {
    if (!lobbyId || !userId) return;

    const socket = io("http://localhost:3002");

    socket.emit("joinRoom", {
      lobbyId,
      userId,
    });

    return () => {
      socket.disconnect();
    };
  }, [lobbyId, userId]);
}