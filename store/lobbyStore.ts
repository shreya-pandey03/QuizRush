import { create } from "zustand";
import { Spectator } from "@/types/socket";

/* TYPES  */
type Player = {
  id: string;
  name: string;
  score: number;

  photo?: string | null;
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

/*  STORE TYPE  */

type LobbyStore = {
  lobby: Lobby | null;

  players: Player[];
  spectators: Spectator[];

  setLobby: (lobby: Lobby | null) => void;
  setPlayers: (players: Player[]) => void;

  setSpectators: (spectators: Spectator[]) => void;

  reset: () => void;
};

/* STORE  */

export const useLobbyStore = create<LobbyStore>((set) => ({
  lobby: null,

  players: [],
  spectators: [],

  setLobby: (lobby) =>
    set({
      lobby,
      players: lobby?.players ?? [],
    }),

  setPlayers: (players) =>
    set((state) => ({
      players,
      lobby: state.lobby
        ? {
            ...state.lobby,
            players,
          }
        : null,
    })),

  setSpectators: (spectators) =>
    set(() => ({
      spectators,
    })),

  reset: () =>
    set({
      lobby: null,
      players: [],
      spectators: [],
    }),
}));
