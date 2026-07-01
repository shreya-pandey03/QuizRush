import { Question } from "./question";

export type LobbyStatus = "waiting" | "playing" | "finished";

export type LobbyState = {
  id: string;
  hostId: string;
  category: string;
  difficulty: string;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  started: boolean;
  status: LobbyStatus;
  timer: number;
  answers: Record<string, any>;
  scores: Record<string, number>;
};

export const gameStore = new Map<string, LobbyState>();

export function createLobby(lobbyId: string, hostId: string): LobbyState {
  const lobby: LobbyState = {
    id: lobbyId,
    hostId,
    category: "General",
    difficulty: "Easy",
    players: [],
    questions: [],
    currentQuestionIndex: 0,
    timer: 15,
    answers: {},
    scores: {},
    started: false,
    status: "waiting",
  };

  gameStore.set(lobbyId, lobby);
  return lobby;
}

export function getLobby(lobbyId: string): LobbyState | undefined {
  return gameStore.get(lobbyId);
}

export function resetLobby(lobbyId: string) {
  const lobby = gameStore.get(lobbyId);
  if (!lobby) return;

  lobby.players = [];
  lobby.questions = [];
  lobby.status = "waiting";
  lobby.currentQuestionIndex = 0;
  lobby.timer = 15;
  lobby.answers = {};
  lobby.scores = {};

  gameStore.set(lobbyId, lobby);
}
export type Player = {
  id: string;
  name: string;
  score: number;
  answered: boolean;
};

export type Lobby = {
  id: string;
  started: boolean;
  status: "created" | "waiting" | "playing" | "finished";
  currentQuestionIndex: number;
  timer: number;
  questions: Question[];
  players: Player[];
};