export type Player = {
  id: string;
  name: string;
  score: number;
  answered: boolean;
};

export type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export type LobbyState = {
  lobbyId: string;

  players: Player[];

  questions: Question[];

  currentQuestionIndex: number;

  started: boolean;

  timer: number;

  status:
    | "waiting"
    | "playing"
    | "finished";
};