import { Player } from "./player";
import { Question } from "./question";

export type Lobby = {
  id: string;
  hostId: string;

  players: Player[];

  questions: Question[];

  currentQuestionIndex: number;

  timer: number;

  started: boolean;
};
