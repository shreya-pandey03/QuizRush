

export type UserRole = "host" | "player";

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
};

export type Session = {
  user: AuthUser;
  token?: string;
  expiresAt?: number;
};

export type JoinLobbyAuth = {
  userId: string;
  lobbyId: string;
  playerName: string;
};

export type SocketAuthPayload = {
  userId: string;
  lobbyId: string;
};