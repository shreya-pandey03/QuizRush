import { db } from "@/drizzle/src/db";

export async function lobbyHandlers(
  io: any,
  socket: any
) {
  async function sendActiveLobbies() {
    const lobbies = await db.query.lobbies.findMany({
      where: (l, { eq }) =>
        eq(l.isStarted, false),
    });

    io.emit("activeLobbiesUpdated", lobbies);
  }

  socket.on("createLobby", async () => {
    await sendActiveLobbies();
  });

  socket.on("joinLobby", async () => {
    await sendActiveLobbies();
  });

  socket.on("leaveLobby", async () => {
    await sendActiveLobbies();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
}