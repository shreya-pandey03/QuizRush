import { Trophy, Gamepad2, Users } from "lucide-react";

import JoinLobbyDialog from "../../../components/JoinLobbyDialog";
import HomeButtons from "../../../components/HomeButtons";

import { db } from "../../../drizzle/src/db";
import { getServerSession } from "next-auth";


export default async function HomePage() {
  const session = await getServerSession();

  let myLobbies: {
    id: string;
    lobbyId: string;
    userId: string;
    joinedAt: Date | null;
  }[] = [];

  // Get current DB user from email
  if (session?.user?.email) {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) =>
        eq(u.email, session.user?.email!),
    });

    // Get all joined lobbies using UUID
    if (user) {
      myLobbies =
        await db.query.lobbyPlayers.findMany({
          where: (players, { eq }) =>
            eq(players.userId, user.id),
        });
    }
  }

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

        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 hover:border-orange-500/40 transition">
          <Users
            className="text-orange-500"
            size={30}
          />

          <h2 className="text-white text-xl mt-4 font-semibold">
            Active Lobbies
          </h2>

          <p className="text-neutral-400 mt-2">
            {myLobbies.length} rooms
          </p>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 hover:border-orange-500/40 transition">
          <Gamepad2
            className="text-orange-500"
            size={30}
          />

          <h2 className="text-white text-xl mt-4 font-semibold">
            Games Played
          </h2>

          <p className="text-neutral-400 mt-2">
            24 Matches
          </p>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 hover:border-orange-500/40 transition">
          <Trophy
            className="text-orange-500"
            size={30}
          />

          <h2 className="text-white text-xl mt-4 font-semibold">
            Wins
          </h2>

          <p className="text-neutral-400 mt-2">
            10 Victories
          </p>
        </div>

      </div>

      {/* Main Buttons */}

      <div className="mt-10">
        <HomeButtons />
      </div>

      {/* Active Lobby Section */}

      <div className="mt-12">

        <div className="flex justify-between items-center">

          <h2 className="text-white text-2xl font-bold">
            My Active Lobbies
          </h2>

          <button
            className="
            px-4
            py-2
            rounded-lg
            bg-orange-500
            hover:bg-orange-600
            text-white
            transition
            "
          >
            Refresh
          </button>

        </div>

        {myLobbies.length === 0 ? (

          <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">

            <div className="h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
              <Users
                size={30}
                className="text-orange-500"
              />
            </div>

            <h3 className="text-white text-xl font-semibold mt-5">
              No Active Lobbies
            </h3>

            <p className="text-neutral-400 mt-2">
              Join or create a lobby to see it here.
            </p>

          </div>

        ) : (

          <div className="space-y-4 mt-6">

            {myLobbies.map((room) => (
              <div
                key={room.id}
                className="
                bg-white/[0.03]
                border
                border-white/10
                rounded-2xl
                p-5
                flex
                items-center
                justify-between
                hover:border-orange-500/40
                transition
                "
              >

                <div>

                  <p className="text-white font-medium">
                    Lobby ID
                  </p>

                  <p className="text-orange-500 mt-1 text-sm">
                    {room.lobbyId}
                  </p>

                </div>

                <HomeButtons
                  lobbyId={room.lobbyId}
                />

              </div>
            ))}

          </div>

        )}

      </div>

      {/* Join Lobby */}

      <div className="mt-12">
        <JoinLobbyDialog />
      </div>

    </main>
  );
}