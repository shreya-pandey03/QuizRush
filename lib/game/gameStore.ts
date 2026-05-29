export type Player = {
  id: string;
  name: string;
  score: number;
  answered: boolean;
};

export type Lobby = {
  id: string;

  hostId: string;

  players: Player[];

  currentQuestionIndex: number;

  questions: any[];

  timer: number;

  started: boolean;
};

export const gameStore =
  new Map<string, Lobby>();