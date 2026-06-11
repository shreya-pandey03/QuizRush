export type LobbyStatus = "created" | "playing" | "finished";

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

  players: Player[];

  // LIVE ONLY (NO DB SOURCE OF TRUTH HERE)
  currentQuestionIndex: number;
  timer: number;

  started: boolean;
  status: LobbyStatus;

  // optional cache (NOT authoritative)
  questions?: Question[];

  category?: string;
  difficulty?: string;
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

//GAME STORE (IN MEMORY)

export const gameStore = new Map<string, LobbyState>();

// CREATE LOBBY

export function createLobby(lobbyId: string): LobbyState {
  const lobby: LobbyState = {
    id: lobbyId,
    players: [],

    currentQuestionIndex: 0,
    timer: 0,

    started: false,
    status: "created",

    questions: [],
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

// UPDATE LOBBY

export function resetLobby(lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby) return;

  // reset ONLY runtime state
  lobby.players = [];
  lobby.currentQuestionIndex = 0;
  lobby.timer = 0;

  lobby.started = false;
  lobby.status = "created";

  // clear cached questions
  lobby.questions = [];

  gameStore.set(lobbyId, lobby);
}
