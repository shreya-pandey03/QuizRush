import { Player } from "./player";
import { Question } from "./question";

export type Lobby = {
  id: string;
  hostId: string;

  category: string;
  difficulty: string;

  status:
    | "waiting"
    | "started"
    | "playing"
    | "finished";

  players: Player[];

  questions: Question[];

  currentQuestionIndex: number;

  timer: number;

  started: boolean;

  answers: Record<string, string[]>;

  scores: Record<string, number>;
};