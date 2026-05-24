export type Lobby = {
  id: string;
  name: string;
  hostId: string;
  code: string;
  isStarted: boolean;
  createdAt: Date | null;

  // add this
  players: number;
};