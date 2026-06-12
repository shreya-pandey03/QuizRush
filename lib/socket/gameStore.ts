


export const gameStore = new Map<string, LobbyState>();

export function hydrateLobby(lobbyId: string, lobby: LobbyState) {
  gameStore.set(lobbyId, lobby);
}

export type LobbyStatus = "created" | "waiting" | "playing" | "finished";

//  ONLY LIVE GAME STATE (RAM ONLY)

export type Player = {
  socketId: string;
  id: string;
  name: string;
  score: number;
  answered: boolean;
};

export type LobbyState = {
  id: string;
  hostId?: string;

  players: Player[];

  currentQuestionIndex: number;
  timer: number;

  started: boolean;
  status: LobbyStatus;

  questions?: Question[];

  category?: string;
  difficulty?: string;

  answers?: Record<string, string[]>;
  scores?: Record<string, number>;
};

export type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;

  // ⚠️ ideally remove this in production (security)
  answer: string;
};

// CREATE LOBBY

export function createLobby(lobbyId: string): LobbyState {
  const lobby: LobbyState = {
    id: lobbyId,
    players: [],

    currentQuestionIndex: 0,
    timer: 0,

    started: false,
    status: "created",

    questions: [], //always defined

    category: undefined,
    difficulty: undefined,
  };

  gameStore.set(lobbyId, lobby);
  return lobby;
}

// GET LOBBY

export function getLobby(lobbyId: string) {
  return gameStore.get(lobbyId);
}

//Reset lobby
export function resetLobby(lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  lobby.players = [];
  lobby.currentQuestionIndex = 0;
  lobby.timer = 0;

  lobby.started = false;
  lobby.status = "created";

  lobby.questions = []; // safe now

  gameStore.set(lobbyId, lobby);
}
