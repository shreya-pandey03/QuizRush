import { Lobby } from "@/types/lobby";

export type LobbyStatus = "created" | "playing" | "finished";

// ONLY runtime game state (NOT DB shape)
export type LobbyState = {
  scores: {};
  answers: {};
  difficulty: any;
  category: any;
  id: string;
  players: {
    id: string;
    name: string;
    score: number;
    answered: boolean;
  }[];
  questions: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    answer: string;
  }[];
  started: boolean;
  status: LobbyStatus;
  currentQuestionIndex: number;
  timer: number;
};

export const gameStore = new Map<string, LobbyState>();

export function createLobby(lobbyId: string): LobbyState {
  const lobby: LobbyState = {
    id: lobbyId,
    players: [],
    questions: [],
    started: false,
    status: "created",
    currentQuestionIndex: 0,
    timer: 0,
  };

  gameStore.set(lobbyId, lobby);
  return lobby;
}

export function getLobby(lobbyId: string) {
  return gameStore.get(lobbyId);
}

export function resetLobby(lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  lobby.players = [];
  lobby.questions = [];
  lobby.started = false;
  lobby.status = "created";
  lobby.currentQuestionIndex = 0;
  lobby.timer = 0;

  gameStore.set(lobbyId, lobby);
}
