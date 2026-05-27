import { Trophy, Gamepad2, Users } from "lucide-react";

import JoinLobbyDialog from "../../../components/JoinLobbyDialog";
import HomeButtons from "../../../components/HomeButtons";

import { db } from "../../../drizzle/src/db";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const session = await getServerSession();

  const userId = session?.user?.email;

  const myLobbies = userId
    ? await db.query.lobbyPlayers.findMany({
        where: (players, { eq }) => eq(players.userId, userId),
      })
    : [];
  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">
      <h1 className="text-4xl font-bold text-white">
        Multiplayer Quiz Dashboard
      </h1>

      <p className="mt-2 text-neutral-400">
        Create rooms, challenge players and dominate the leaderboard.
      </p>

      {/* Stats Cards */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">
          <Users className="text-orange-500" size={30} />

          <h2 className="text-white text-xl mt-4 font-semibold">
            Active Lobbies
          </h2>

          <p className="text-neutral-400 mt-2">{myLobbies.length} rooms</p>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">
          <Gamepad2 className="text-orange-500" size={30} />

          <h2 className="text-white text-xl mt-4 font-semibold">
            Games Played
          </h2>

          <p className="text-neutral-400 mt-2">24 matches</p>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">
          <Trophy className="text-orange-500" size={30} />

          <h2 className="text-white text-xl mt-4 font-semibold">Wins</h2>

          <p className="text-neutral-400 mt-2">10 victories</p>
        </div>
      </div>

      {/* Buttons */}

      <div className="mt-10">
        <HomeButtons />
      </div>

      {/* Active Lobbies */}

      <div className="mt-10">
        <h2 className="text-white text-2xl font-bold">My Active Lobbies</h2>

        {myLobbies.length === 0 ? (
          <p className="text-neutral-400 mt-4">No active lobbies</p>
        ) : (
          myLobbies.map((room) => (
            <div
              key={room.id}
              className="
              mt-4
              bg-white/[0.03]
              border
              border-white/10
              rounded-xl
              p-4
              "
            >
              <p className="text-white">Lobby ID: {room.lobbyId}</p>

              <HomeButtons lobbyId={room.lobbyId} />
            </div>
          ))
        )}
      </div>

      <div className="mt-10">
        <JoinLobbyDialog />
      </div>
    </main>
  );
}
