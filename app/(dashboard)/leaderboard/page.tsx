import { db } from "@/drizzle/src/db";
import { gameHistory } from "@/drizzle/src/db/schema";
import { desc } from "drizzle-orm";


export default async function LeaderboardPage() {
  const results = await db
    .select()
    .from(gameHistory)
    .orderBy(desc(gameHistory.score));

  // simple aggregation (top users)
  const map = new Map<
    string,
    { userId: string; score: number; games: number }
  >();

  for (const r of results) {
    const existing = map.get(r.userId);

    if (!existing) {
      map.set(r.userId, {
        userId: r.userId,
        score: r.score,
        games: 1,
      });
    } else {
      existing.score += r.score;
      existing.games += 1;
      map.set(r.userId, existing);
    }
  }

  const leaderboard = Array.from(map.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return (
    <main
      className="relative min-h-screen overflow-x-hidden p-6"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
          linear-gradient(rgba(234,120,30,.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(234,120,30,.055) 1px, transparent 1px)
        `,
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />

      {/* Orange Glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top center, rgba(234,120,30,.12), transparent 60%)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p
            style={{
              color: "#ea781e",
              fontSize: 12,
              letterSpacing: ".25em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Leaderboard
          </p>

          <h1
            style={{
              fontSize: 42,
              fontWeight: 400,
              color: "#f5f0e8",
              fontFamily: "Georgia, serif",
              marginBottom: 8,
            }}
          >
            Global Rankings
          </h1>

          <p
            style={{
              color: "rgba(245,240,232,.55)",
              fontSize: 15,
            }}
          >
            Top players ranked by total score across all quizzes.
          </p>
        </div>

        {/* Table */}
        <div
          style={{
            background: "rgba(234,120,30,.05)",
            border: "0.5px solid rgba(234,120,30,.15)",
            borderRadius: 24,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr 140px 140px",
              padding: "18px 24px",
              borderBottom: "0.5px solid rgba(234,120,30,.15)",
              color: "#ea781e",
              fontSize: 12,
              letterSpacing: ".15em",
              textTransform: "uppercase",
            }}
          >
            <div>Rank</div>
            <div>Player</div>
            <div>Games</div>
            <div>Score</div>
          </div>

          {leaderboard.map((p, index) => {
            const medal =
              index === 0
                ? "🥇"
                : index === 1
                  ? "🥈"
                  : index === 2
                    ? "🥉"
                    : `#${index + 1}`;

            return (
              <div
                key={p.userId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 140px 140px",
                  alignItems: "center",
                  padding: "20px 24px",
                  borderBottom:
                    index !== leaderboard.length - 1
                      ? "0.5px solid rgba(245,240,232,.05)"
                      : "none",
                }}
              >
                {/* Rank */}
                <div
                  style={{
                    color:
                      index === 0
                        ? "#FFD700"
                        : index === 1
                          ? "#C0C0C0"
                          : index === 2
                            ? "#CD7F32"
                            : "#ea781e",
                    fontWeight: 700,
                    fontSize: 22,
                  }}
                >
                  {medal}
                </div>

                {/* Player */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "rgba(234,120,30,.1)",
                      border: "0.5px solid rgba(234,120,30,.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ea781e",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {p.userId.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#f5f0e8",
                        fontSize: 16,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {p.userId}
                    </div>

                    <div
                      style={{
                        color: "rgba(245,240,232,.45)",
                        fontSize: 13,
                      }}
                    >
                      QuizRush Player
                    </div>
                  </div>
                </div>

                {/* Games */}
                <div
                  style={{
                    color: "rgba(245,240,232,.7)",
                    fontSize: 18,
                  }}
                >
                  {p.games}
                </div>

                {/* Score */}
                <div
                  style={{
                    color: "#ea781e",
                    fontWeight: 700,
                    fontSize: 22,
                  }}
                >
                  {p.score} pts
                </div>
              </div>
            );
          })}

          {leaderboard.length === 0 && (
            <div
              style={{
                padding: 60,
                textAlign: "center",
                color: "rgba(245,240,232,.45)",
              }}
            >
              No leaderboard data yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
