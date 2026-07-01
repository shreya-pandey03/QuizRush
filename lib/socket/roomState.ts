export type Player = {
  id: string;
  name: string;
};

export type RoomState = {
  players: Player[];

  currentQuestion: number;

  quizStarted: boolean;

  scores: Record<string, number>;
};

export const rooms: Record<string, RoomState> = {};
