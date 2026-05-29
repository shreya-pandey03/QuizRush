import {
  Server,
  Socket,
} from "socket.io";

import {
  rooms,
  Player,
} from "./roomState";

export function playerHandlers(
  io: Server,
  socket: Socket,
) {

  socket.on(
    "joinRoomWithUser",
    ({
      roomId,
      user,
    }: {
      roomId: string;

      user: Player;
    }) => {

      socket.join(
        roomId
      );

      // Create room if missing

      if (
        !rooms[roomId]
      ) {

        rooms[
          roomId
        ] = {

          players: [],

          currentQuestion: 0,

          quizStarted: false,

          scores: {},

        };

      }

      // Prevent duplicates

      const exists =
        rooms[
          roomId
        ].players.find(
          (
            player
          ) =>
            player.id ===
            user.id
        );

      if (!exists) {

        rooms[
          roomId
        ].players.push(
          user
        );

      }

      // Send updated players

      io.to(roomId).emit(
        "playersUpdated",
        rooms[
          roomId
        ].players
      );

      console.log(
        `${user.name} joined ${roomId}`
      );

    }
  );

  socket.on(
    "disconnecting",
    () => {

      socket.rooms.forEach(
        (
          roomId
        ) => {

          if (
            rooms[
              roomId
            ]
          ) {

            rooms[
              roomId
            ].players =
              rooms[
                roomId
              ].players.filter(
                (
                  player
                ) =>
                  player.id !==
                  socket.id
              );

            io.to(roomId).emit(
              "playersUpdated",
              rooms[
                roomId
              ].players
            );

          }

        }
      );

    }
  );

}