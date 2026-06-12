export interface SocketPayload {
  roomId: string;
  userId: string;
  data: any;
}

export type RejoinLobbyPayload = {
  lobbyId: string;
  userId: string;
};
