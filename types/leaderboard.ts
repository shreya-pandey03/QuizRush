

export type LeaderboardPlayer = {
  id: string;
  name: string;
  score: number;
  rank?: number;
};

export type Leaderboard = {
  lobbyId: string;
  players: LeaderboardPlayer[];
  totalQuestions: number;
  finishedAt: number;
};

export type QuizResult = {
  lobbyId: string;
  playerId: string;
  score: number;
  correct: number;
  wrong: number;
  percentage: number;
};

export type QuizEndedPayload = {
  leaderboard: LeaderboardPlayer[];
};