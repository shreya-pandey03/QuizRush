import { create } from "zustand";

type Player = {
  id: string;
  name: string;
  score: number;
};

type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
};

type Lobby = {
  id: string;

  players: Player[];

  started: boolean;

  status: "waiting" | "playing" | "finished";

  currentQuestionIndex: number;

  timer: number;

  questions: Question[];

  category: string;

  difficulty: string;
};

type LobbyStore = {
  lobby: Lobby | null;

  setLobby: (lobby: Lobby | null) => void;

  setPlayers: (players: Player[]) => void;

  setPlayersFromLobby: (players: Player[]) => void;
};

export const useLobbyStore = create<LobbyStore>((set, get) => ({
  lobby: null,

  setLobby: (lobby) => set({ lobby }),

  setPlayers: (players) => {
    const lobby = get().lobby;

    if (!lobby) return;

    set({
      lobby: {
        ...lobby,
        players,
      },
    });
  },

  setPlayersFromLobby: (players) => {
    get().setPlayers(players);
  },
}));