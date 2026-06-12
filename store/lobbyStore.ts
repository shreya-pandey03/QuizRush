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
  setPlayers(arg0: never[]): unknown;
  lobby: Lobby | null;

  setLobby: (lobby: Lobby | null) => void;

  setPlayersFromLobby: (players: Player[]) => void;
};

export const useLobbyStore = create<LobbyStore>((set, get) => ({
  lobby: null,

  setLobby: (lobby) => set({ lobby }),

  setPlayersFromLobby: (players) => {
    const lobby = get().lobby;

    if (!lobby) return;

    set({
      lobby: {
        ...lobby,
        players,
      },
    });
  },
}));
