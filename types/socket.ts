export type JoinLobbyPayload = {
  lobbyId: string;
  player: {
    photo: null;
    id: string;
    name: string;
    userId: string;
  };
};

export type RejoinLobbyPayload = {
  lobbyId: string;
  userId: string;
  playerId: string;
  socketId: string;
  
};

export type Spectator = {
  id: string;
  name: string;
  socketId: string;
};

export type JoinSpectatorPayload = {
  lobbyId: string;
  spectator: {
    id: string;
    name: string;
  };
};

