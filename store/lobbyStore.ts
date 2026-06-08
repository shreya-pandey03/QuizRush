import { create } from "zustand";

type Player = {
  id: string;
  name: string;
  score: number;
};

type Lobby = {
  id: string;
  players: Player[];
  started: boolean;
};

type LobbyStore = {
  id: any;
  lobby: Lobby | null;
  setLobby: (lobby: Lobby | null) => void;

  // optional but IMPORTANT if you use players separately
  players: Player[];
  setPlayers: (players: Player[]) => void;
};

export const useLobbyStore = create<LobbyStore>((set) => ({
  lobby: null,
  players: [],

  setLobby: (lobby) => set({ lobby }),

  setPlayers: (players) => set({ players }),
}));
