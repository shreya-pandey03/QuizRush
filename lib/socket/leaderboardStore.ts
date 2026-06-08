type PlayerScore = {
  playerId: string;
  name: string;
  score: number;
};

type Leaderboard = Map<string, PlayerScore>; // lobbyId -> players

class LeaderboardStore {
  private store: Map<string, Leaderboard> = new Map();

  initLobby(lobbyId: string) {
    if (!this.store.has(lobbyId)) {
      this.store.set(lobbyId, new Map());
    }
  }

  addPlayer(lobbyId: string, playerId: string, name: string) {
    this.initLobby(lobbyId);
    const board = this.store.get(lobbyId)!;

    if (!board.has(playerId)) {
      board.set(playerId, { playerId, name, score: 0 });
    }
  }

  addScore(lobbyId: string, playerId: string, points: number) {
    const board = this.store.get(lobbyId);
    if (!board) return;

    const player = board.get(playerId);
    if (!player) return;

    player.score += points;
  }

  getLeaderboard(lobbyId: string) {
    const board = this.store.get(lobbyId);
    if (!board) return [];

    return Array.from(board.values()).sort((a, b) => b.score - a.score);
  }

  resetLobby(lobbyId: string) {
    this.store.delete(lobbyId);
  }
}

export const leaderboardStore = new LeaderboardStore();