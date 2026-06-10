import { Server, Socket } from "socket.io";
import { leaderboardStore } from "../socket/leaderboardStore";


export function registerAnswerHandlers(io: Server, socket: Socket) {
socket.on("submit-answer", (data) => {
   console.log("ANSWER RECEIVED:", data);

  leaderboardStore.addPlayer(
    data.lobbyId,
    data.playerId,
    data.name,
  );

  if (data.isCorrect) {
    leaderboardStore.addScore(
      data.lobbyId,
      data.playerId,
      10,
    );
  }

  const updated = leaderboardStore.getLeaderboard(data.lobbyId);

  console.log("FINAL LEADERBOARD:", updated);

  io.to(data.lobbyId).emit("leaderboard:update", updated);
});
}