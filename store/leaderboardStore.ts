import { create } from "zustand";

type Player = {
  id: string;
  name: string;
  score: number;
};

interface LeaderboardStore {
  leaderboard: Player[];

  setLeaderboard: (players: Player[]) => void;
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  leaderboard: [],

  setLeaderboard: (leaderboard) =>
    set({
      leaderboard,
    }),
}));
