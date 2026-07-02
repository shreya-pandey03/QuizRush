export const dynamic = "force-dynamic";

import { db } from "@/drizzle/src/db";
import { gameHistory } from "@/drizzle/src/db/schema";
import { desc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type GameHistory = InferSelectModel<typeof gameHistory>;

export default async function LeaderboardPage() {
  let results: GameHistory[] = [];

  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL missing");
      results = [];
    } else {
      results = await db
        .select()
        .from(gameHistory)
        .orderBy(desc(gameHistory.score));
    }
  } catch (err) {
    console.error("Leaderboard DB error:", err);
    results = [];
  }

  const map = new Map<
    string,
    { userId: string; score: number; games: number }
  >();

  for (const r of results) {
    const existing = map.get(r.userId);

    if (!existing) {
      map.set(r.userId, {
        userId: r.userId,
        score: r.score ?? 0,
        games: 1,
      });
    } else {
      existing.score += r.score ?? 0;
      existing.games += 1;
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
        }}
      />

      {/* Glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top center, rgba(234,120,30,.12), transparent 60%)",
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
        {/* HEADER */}
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

        {/* TABLE */}
        <div
          style={{
            background: "rgba(234,120,30,.05)",
            border: "0.5px solid rgba(234,120,30,.15)",
            borderRadius: 24,
            backdropFilter: "blur(10px)",
            overflow: "hidden",
          }}
        >
          {/* Horizontal scroll wrapper */}
          <div
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div
              style={{
                minWidth: 620,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 120px 120px",
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

              {/* Rows */}
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
                      gridTemplateColumns: "90px 1fr 120px 120px",
                      alignItems: "center",
                      padding: "20px 24px",
                      borderBottom:
                        index !== leaderboard.length - 1
                          ? "0.5px solid rgba(245,240,232,.05)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        color: "#ea781e",
                        fontWeight: 700,
                      }}
                    >
                      {medal}
                    </div>

                    <div
                      style={{
                        color: "#f5f0e8",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        paddingRight: 20,
                      }}
                    >
                      {p.userId}
                    </div>

                    <div
                      style={{
                        color: "rgba(245,240,232,.7)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.games}
                    </div>

                    <div
                      style={{
                        color: "#ea781e",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.score} pts
                    </div>
                  </div>
                );
              })}

              {/* Empty state */}
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
        </div>
      </div>
    </main>
  );
}
