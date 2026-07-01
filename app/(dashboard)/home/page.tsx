"use client";

import { Trophy, Gamepad2, Users, Plus, LogIn, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Lobby = {
  code: any;
  id: string;
  lobbyId: string;
  userId: string;
  joinedAt: Date | null;
};

type GameHistoryItem = {
  id: string;
  lobbyId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  createdAt: Date;
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [myLobbies, setMyLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const gamesPlayed = history.length;

  const wins = history.filter(
    (game) => game.score >= game.totalQuestions * 0.8,
  ).length;

  //game-history
  useEffect(() => {
    const email = session?.user?.email;

    if (!email) return;

    async function loadHistory() {
      const res = await fetch(`/api/history?userId=${email}`);

      const data = await res.json();

      console.log("HISTORY FROM API:", data);

      setHistory(data);
    }

    loadHistory();
  }, [session]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup");
    }
  }, [status, router]);

  // Fetch lobbies
  async function fetchLobbies() {
    try {
      console.log("👉 calling /api/lobbies");

      const res = await fetch("/api/lobbies");

      console.log("👉 response:", res.status);

      const data = await res.json();

      console.log("👉 lobbies data:", data);

      setMyLobbies(data);
    } catch (e) {
      console.error("Failed to fetch lobbies", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchLobbies();
    }
  }, [status]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchLobbies();
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        <div
          style={{
            color: "#ea781e",
            fontFamily: "Georgia, serif",
            fontSize: 16,
          }}
        >
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-x-hidden p-8"
      style={{ background: "#0a0a0a", color: "#f5f0e8" }}
    >
      {/* ── Grid background ── */}
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

      {/* ── Top radial glow ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(234,120,30,.13) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      {/* ── Bottom-right glow ── */}
      <div
        className="fixed bottom-0 right-0 pointer-events-none"
        style={{
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(234,120,30,.07)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* ── Scanline sweep ── */}
      <div
        className="fixed left-0 right-0 pointer-events-none"
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(234,120,30,.25), transparent)",
          animation: "qrScan 6s linear infinite",
          zIndex: 1,
        }}
      />

      {/* ── Floating orbs ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "20%",
          left: "3%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.3), 0 0 36px rgba(234,120,30,.18)",
          animation: "floatA 8s ease-in-out infinite",
          opacity: 0.45,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "55%",
          right: "3%",
          width: 52,
          height: 52,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.25), 0 0 22px rgba(234,120,30,.15)",
          animation: "floatB 10s ease-in-out infinite",
          opacity: 0.4,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "18%",
          left: "8%",
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.4)",
          animation: "floatC 6s ease-in-out infinite",
          opacity: 0.55,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "10%",
          right: "12%",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.35)",
          animation: "floatA 7s ease-in-out infinite",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* ── Spinning orbital rings ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "8%",
          left: "2%",
          width: 110,
          height: 110,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.15)",
          animation: "spinRing 22s linear infinite",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "8%",
          right: "3%",
          width: 70,
          height: 70,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.12)",
          animation: "spinRing 16s linear infinite reverse",
          zIndex: 0,
        }}
      />

      {/*PAGE CONTENT*/}
      <div
        className="relative"
        style={{ zIndex: 10, maxWidth: 900, margin: "0 auto" }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-start justify-between flex-wrap gap-4 pb-6"
          style={{ borderBottom: "0.5px solid rgba(234,120,30,.15)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: "#ea781e" }}>⚡</span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#ea781e",
                }}
              >
                QuizRush
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.4rem)",
                fontWeight: 400,
                fontFamily: "Georgia, serif",
                color: "#f5f0e8",
                lineHeight: 1.1,
              }}
            >
              Welcome back,{" "}
              <span style={{ color: "#ea781e", fontStyle: "italic" }}>
                {session?.user?.name?.split(" ")[0] ?? "Player"}
              </span>
            </h1>
            <p
              style={{
                color: "#ffffffff",
                marginTop: 8,
                fontSize: 14,
                fontFamily: "Georgia, serif",
              }}
            >
              Create rooms, challenge players and dominate the leaderboard.
            </p>
          </div>

          {/* Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(234,120,30,.1)",
              border: "0.5px solid rgba(234,120,30,.35)",
              borderRadius: 100,
              padding: "6px 14px",
              fontSize: 11,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "#ea781e",
              alignSelf: "flex-start",
              marginTop: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ea781e",
                display: "inline-block",
                animation: "qrBlink 1s step-end infinite",
              }}
            />
            Live
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            {
              icon: <Users size={24} style={{ color: "#ea781e" }} />,
              title: "Active Lobbies",
              value: `${myLobbies.length} rooms`,
            },
            {
              icon: <Gamepad2 size={24} style={{ color: "#ea781e" }} />,
              title: "Games Played",
              value: `${gamesPlayed} Matches`,
            },
            {
              icon: <Trophy size={24} style={{ color: "#ea781e" }} />,
              title: "Wins",
              value: `${wins} Victories`,
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: "rgba(234,120,30,.04)",
                border: "0.5px solid rgba(234,120,30,.15)",
                borderRadius: 14,
                padding: "1.5rem",
                transition: "border-color .2s, background .2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(234,120,30,.4)";
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(234,120,30,.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(234,120,30,.15)";
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(234,120,30,.04)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "rgba(234,120,30,.1)",
                  border: "0.5px solid rgba(234,120,30,.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </div>
              <h2
                style={{
                  color: "#f5f0e8",
                  fontSize: 16,
                  fontWeight: 400,
                  fontFamily: "Georgia, serif",
                  marginTop: 14,
                }}
              >
                {card.title}
              </h2>
              <p style={{ color: "#ea781e", marginTop: 6, fontSize: 14 }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={() => router.push("/lobby/create")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 10,
              background: "#ea781e",
              border: "none",
              color: "#fff",
              fontSize: 14,
              fontFamily: "Georgia, serif",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(234,120,30,.25)",
              transition: "background .2s, transform .15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#d46a15";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ea781e";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            <Plus size={16} /> Create Room
          </button>

          {/*lobby redirect */}
          <button
            onClick={() => router.push("/lobby/join")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 10,
              background: "transparent",
              border: "0.5px solid rgba(234,120,30,.4)",
              color: "#ea781e",
              fontSize: 14,
              fontFamily: "Georgia, serif",
              cursor: "pointer",
              transition: "border-color .2s, background .2s, transform .15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(234,120,30,.08)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            <LogIn size={16} /> Join Room
          </button>
        </div>

        {/* ── Active Lobbies Section ── */}
        {/* <div className="mt-10">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "#ea781e",
                  marginBottom: 4,
                }}
              >
                Your rooms
              </div>
              <h2
                style={{
                  color: "#f5f0e8",
                  fontSize: 20,
                  fontWeight: 400,
                  fontFamily: "Georgia, serif",
                }}
              >
                My Active Lobbies
              </h2>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 20px",
                borderRadius: 8,
                background: "#ea781e",
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontFamily: "Georgia, serif",
                cursor: refreshing ? "not-allowed" : "pointer",
                opacity: refreshing ? 0.7 : 1,
                boxShadow: "0 4px 16px rgba(234,120,30,.2)",
                transition: "background .2s, transform .15s",
              }}
              onMouseEnter={(e) => {
                if (refreshing) return;
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#d46a15";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#ea781e";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              <RefreshCw
                size={13}
                style={{
                  animation: refreshing ? "spin 1s linear infinite" : "none",
                }}
              />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div
              style={{
                background: "rgba(234,120,30,.04)",
                border: "0.5px solid rgba(234,120,30,.15)",
                borderRadius: 14,
                padding: "3rem",
                textAlign: "center",
                color: "rgba(245,240,232,.35)",
                fontFamily: "Georgia, serif",
                fontSize: 14,
              }}
            >
              Loading lobbies…
            </div>
          ) : myLobbies.length === 0 ? (
            <div
              style={{
                background: "rgba(234,120,30,.04)",
                border: "0.5px solid rgba(234,120,30,.15)",
                borderRadius: 14,
                padding: "3rem 1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(234,120,30,.12)",
                  border: "0.5px solid rgba(234,120,30,.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <Users size={26} style={{ color: "#ea781e" }} />
              </div>
              <h3
                style={{
                  color: "#f5f0e8",
                  fontSize: 17,
                  fontWeight: 400,
                  fontFamily: "Georgia, serif",
                  marginTop: 16,
                }}
              >
                No Active Lobbies
              </h3>
              <p
                style={{
                  color: "rgba(245,240,232,.4)",
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                Join or create a lobby to see it here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myLobbies.map((room) => (
                <div
                  key={room.id}
                  style={{
                    background: "rgba(234,120,30,.04)",
                    border: "0.5px solid rgba(234,120,30,.15)",
                    borderRadius: 12,
                    padding: "1.1rem 1.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "border-color .2s, background .2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(234,120,30,.4)";
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(234,120,30,.07)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(234,120,30,.15)";
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(234,120,30,.04)";
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "rgba(245,240,232,.5)",
                        fontSize: 11,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Lobby ID
                    </p>
                    <p
                      style={{
                        color: "#ea781e",
                        marginTop: 4,
                        fontSize: 15,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {room.lobbyId}
                    </p>
                  </div>
                  <button
                   onClick={() => router.push(`/lobby/${room.code}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 18px",
                      borderRadius: 8,
                      background: "#ea781e",
                      border: "none",
                      color: "#fff",
                      fontSize: 13,
                      fontFamily: "Georgia, serif",
                      cursor: "pointer",
                      transition: "background .2s, transform .15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#d46a15";
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#ea781e";
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    Enter <LogIn size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* ── Join Lobby inline ── */}
        <div
          className="mt-10 pb-10"
          style={{
            borderTop: "0.5px solid rgba(234,120,30,.1)",
            paddingTop: "2rem",
          }}
        >
          <JoinLobbyInline />
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes qrScan   { 0%{top:-2%} 100%{top:102%} }
        @keyframes qrBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatA   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatB   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes floatC   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spinRing { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes spin     { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </main>
  );
}

// ── Inline join lobby widget ──────────────────────────────────────────────────
function JoinLobbyInline() {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  function join() {
    const c = code.trim();
    if (!c) return;
    router.push(`/lobby/${c}`);
  }

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: ".13em",
          textTransform: "uppercase",
          color: "#ea781e",
          marginBottom: 6,
        }}
      >
        Quick join
      </div>
      <h2
        style={{
          color: "#f5f0e8",
          fontSize: 18,
          fontWeight: 400,
          fontFamily: "Georgia, serif",
          marginBottom: 16,
        }}
      >
        Join a Room by Code
      </h2>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && join()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter room code…"
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 10,
            background: "#111",
            border: focused
              ? "0.5px solid rgba(234,120,30,.6)"
              : "0.5px solid rgba(234,120,30,.2)",
            color: "#f5f0e8",
            fontSize: 14,
            fontFamily: "Georgia, serif",
            outline: "none",
            boxShadow: focused ? "0 0 0 3px rgba(234,120,30,.08)" : "none",
            transition: "border-color .2s, box-shadow .2s",
          }}
        />
        <button
          onClick={join}
          disabled={!code.trim()}
          style={{
            padding: "12px 22px",
            borderRadius: 10,
            background: code.trim() ? "#ea781e" : "rgba(234,120,30,.2)",
            border: "none",
            color: code.trim() ? "#fff" : "rgba(245,240,232,.3)",
            fontSize: 14,
            fontFamily: "Georgia, serif",
            cursor: code.trim() ? "pointer" : "not-allowed",
            transition: "background .2s, transform .15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!code.trim()) return;
            (e.currentTarget as HTMLButtonElement).style.background = "#d46a15";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            if (!code.trim()) return;
            (e.currentTarget as HTMLButtonElement).style.background = "#ea781e";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(0)";
          }}
        >
          Join →
        </button>
      </div>
    </div>
  );
}
