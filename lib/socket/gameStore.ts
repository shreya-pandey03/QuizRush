export const gameStore = new Map<string, LobbyState>();

export type LobbyStatus = "created" | "waiting" | "playing" | "finished";

export type Player = {
  photo: any;
  id: string;
  name: string;
  score: number;
  answered: boolean;
  socketId?: string;
  online: boolean;
};

export type Spectator = {
  id: string;
  name: string;
  socketId: string;
};

export type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
};
// lobbbystate
export type LobbyState = {
  ready: any;
  hostName: any;
  id: string;
  lobbyId: string;
  hostId?: string;
  locked: boolean;
  started: boolean;
  players: Player[];
  status: LobbyStatus;
  questions: Question[];
  currentQuestionIndex: number;
  timer: number;
  category?: string;
  difficulty?: string;
  answers: Record<string, string[]>;
  scores: Record<string, number>;
  submitted: Set<string>;
  submittedAt: Record<string, number>;
  startTime?: number;
  endTime?: number;
  duration?: number;
  createdAt: number;
  lastActivity: number;
  answerOrder: string[];
  spectators: Spectator[];
  correctAnswers: Record<string, number>;
  bonuses: Record<string, number>;
};

// CREATE LOBBY
export function createLobby(lobbyId: string): LobbyState {
  const lobby: LobbyState = {
    id: lobbyId,
    lobbyId,
    players: [],
    started: false,
    status: "created",
    questions: [],
    currentQuestionIndex: 0,
    timer: 0,
    locked: false,
    answers: {},
    scores: {},
    submitted: new Set<string>(),
    submittedAt: {},
    startTime: undefined,
    endTime: undefined,
    duration: undefined,
    hostName: undefined,
    ready: undefined,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    answerOrder: [],
    spectators: [],
    correctAnswers: {},
    bonuses: {},
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
  lobby.started = false;
  lobby.status = "created";

  lobby.questions = [];
  lobby.currentQuestionIndex = 0;
  lobby.timer = 0;

  lobby.answers = {};
  lobby.scores = {};
  lobby.submitted = new Set();

  lobby.startTime = undefined;
  lobby.endTime = undefined;
  lobby.duration = undefined;
  lobby.locked = false;

  gameStore.set(lobbyId, lobby);
}

export function isQuizFinished(lobbyId: string) {
  const lobby = gameStore.get(lobbyId);

  if (!lobby?.endTime) return false;

  return Date.now() >= lobby.endTime;
}
