import { create } from "zustand";

type LeaderboardPlayer = {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  bonus: number;
  photo?: string | null;
};

interface LeaderboardStore {
  leaderboard: LeaderboardPlayer[];

  setLeaderboard: (players: LeaderboardPlayer[]) => void;

  reset: () => void;
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  leaderboard: [],

  setLeaderboard: (players) =>
    set({
      leaderboard: players,
    }),

  reset: () =>
    set({
      leaderboard: [],
    }),
}));
