type PlayerScore = {
  userId: string;
  score: number;
};

type RoomState = {
  currentQuestion: number;
  timeLeft: number;
  started: boolean;
  scores: PlayerScore[];
};

export const rooms = new Map<
  string,
  RoomState
>();