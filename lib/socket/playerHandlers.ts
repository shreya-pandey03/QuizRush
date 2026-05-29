import { Server, Socket } from "socket.io";

import {
  gameStore,
} from "../game/gameStore";

export function playerHandlers(
  io: Server,
  socket: Socket
) {

  socket.on(
    "join-lobby",
    ({
      lobbyId,
      player,
    }) => {

      let lobby =
        gameStore.get(
          lobbyId
        );

      if (!lobby) {

        lobby = {
          id: lobbyId,

          hostId:
            player.id,

          players: [],

          currentQuestionIndex:
            0,

          questions: [],

          timer: 15,

          started: false,
        };

        gameStore.set(
          lobbyId,
          lobby
        );
      }

      socket.join(
        lobbyId
      );

      lobby.players.push({
        id: player.id,

        name:
          player.name,

        score: 0,

        answered:
          false,
      });

      io.to(lobbyId).emit(
        "players-update",
        lobby.players
      );
    }
  );
}