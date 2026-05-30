import { create } from "zustand";

type Player = {
  id: string;
  name: string;
  score: number;
};

interface LobbyStore {
  players: Player[];

  setPlayers: (players: Player[]) => void;
}

export const useLobbyStore = create<LobbyStore>((set) => ({
  players: [],

  setPlayers: (players) =>
    set({
      players,
    }),
}));
