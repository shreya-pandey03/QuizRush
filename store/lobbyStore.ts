import { create } from "zustand";

interface Lobby {
  id: string;
  name: string;
}

interface LobbyState {
  lobby: Lobby | null;

  setLobby: (data: Lobby) => void;
}

export const useLobbyStore = create<LobbyState>((set) => ({
  lobby: null,

  setLobby: (data) => {
    set({
      lobby: data,
    });
  },
}));
