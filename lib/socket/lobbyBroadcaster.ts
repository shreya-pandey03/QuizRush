import { gameStore } from "./gameStore";
import { Server } from "socket.io";

export function emitLobbyList(io: Server) {
  const lobbies = Array.from(gameStore.entries()).map(([id, lobby]) => ({
    id,
    hostId: lobby.hostId,
    hostName: lobby.hostName,
    players: lobby.players,
    status: lobby.status,
  }));

  io.emit("lobby-list-update", lobbies);
}