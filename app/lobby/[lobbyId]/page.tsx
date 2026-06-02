"use client";

import { useParams, useRouter } from "next/navigation";
import { Users, Copy, Play, Check, Crown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QuizLobbyClient from "./QuizLobbyClient";
import { socket } from "@/lib/socket/socket";



export default function LobbyRoomPage() {
  const params = useParams();

  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [quizStarted, setQuizStarted] = useState(false);
  

  const lobbyId = Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : (params.lobbyId?.toString() ?? "");

  const [userId, setUserId] = useState("");

  // Guest ID
  useEffect(() => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }
    setUserId(guestId);
  }, []);

  // Socket connection
useEffect(() => {
  if (!lobbyId) return;

  let guestId = localStorage.getItem("guestId");

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }

   if (!socket.connected) {
    socket.connect();
  }


  const user = {
    id: guestId,
    name: guestId.slice(0, 6),
  };

  socket.emit("joinRoomWithUser", {
    roomId: lobbyId,
    user,
  });

  const handlePlayersUpdated = (
    updatedPlayers: {
      id: string;
      name: string;
    }[]
  ) => {
    setPlayers(updatedPlayers);
  };

  socket.on(
    "playersUpdated",
    handlePlayersUpdated
  );

  return () => {
    socket.off(
      "playersUpdated",
      handlePlayersUpdated
    );
  };
}, [lobbyId]);

  // Copy lobby ID
  async function copyRoomId() {
    if (!lobbyId) return;
    try {
      await navigator.clipboard.writeText(lobbyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  }

  // Start quiz
  function startQuiz() {
    if (quizStarted) return;
    setQuizStarted(true);

    // Emit to server (notify other players)
if (lobbyId) {
  socket.emit("startQuiz", lobbyId);
}

    // Redirect immediately — don't wait for socket response
    router.push(`/quiz/${lobbyId}`);
  }

  return (
    <main
      className="relative min-h-screen overflow-x-hidden p-8"
      style={{ background: "#0a0a0a" }}
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

      {/* ── Scanline ── */}
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
          top: "18%",
          left: "4%",
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
          top: "58%",
          right: "4%",
          width: 50,
          height: 50,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.25), 0 0 20px rgba(234,120,30,.15)",
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
          width: 28,
          height: 28,
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
          width: 18,
          height: 18,
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
          top: "6%",
          left: "2%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.14)",
          animation: "spinRing 22s linear infinite",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "8%",
          right: "3%",
          width: 65,
          height: 65,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.11)",
          animation: "spinRing 16s linear infinite reverse",
          zIndex: 0,
        }}
      />

      {/* ══════════════════════════════════════════
          PAGE CONTENT
      ══════════════════════════════════════════ */}
      <div className="relative max-w-3xl mx-auto" style={{ zIndex: 10 }}>
        {/* Quiz Lobby Client */}
        <QuizLobbyClient lobbyId={lobbyId} />

        {/* ── Header ── */}
        <div
          className="flex items-start justify-between flex-wrap gap-3 pb-6 mb-6"
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
                QuizRush — Lobby
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                fontWeight: 400,
                fontFamily: "Georgia, serif",
                color: "#f5f0e8",
                lineHeight: 1.1,
              }}
            >
              Quiz{" "}
              <span style={{ color: "#ea781e", fontStyle: "italic" }}>
                Lobby
              </span>{" "}
              🎮
            </h1>
            <p
              style={{
                color: "rgba(245,240,232,.45)",
                marginTop: 6,
                fontSize: 14,
                fontFamily: "Georgia, serif",
              }}
            >
              Waiting for players to join…
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
            {players.length} online
          </div>
        </div>

        {/* ── Main card ── */}
        <div
          style={{
            borderRadius: 20,
            background: "rgba(13,13,13,.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "0.5px solid rgba(234,120,30,.2)",
            padding: "2rem",
            boxShadow:
              "0 0 0 0.5px rgba(234,120,30,.08), 0 32px 80px rgba(0,0,0,.5)",
          }}
        >
          {/* ── Room code box ── */}
          <div
            style={{
              borderRadius: 12,
              background: "#0d0d0d",
              border: "0.5px solid rgba(234,120,30,.2)",
              padding: "1.25rem 1.5rem",
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: ".13em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,.4)",
                marginBottom: 10,
              }}
            >
              Lobby Code
            </p>
            <div className="flex items-center justify-between gap-4">
              <span
                style={{
                  color: "#ea781e",
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                  letterSpacing: ".12em",
                  fontWeight: 400,
                }}
              >
                {lobbyId}
              </span>
              <button
                onClick={copyRoomId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 18px",
                  borderRadius: 8,
                  background: copied ? "rgba(59,109,17,.2)" : "#ea781e",
                  border: copied ? "0.5px solid #3B6D11" : "none",
                  color: copied ? "#97C459" : "#fff",
                  fontSize: 13,
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                  transition: "background .2s, transform .15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (copied) return;
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#d46a15";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  if (copied) return;
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#ea781e";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                {copied ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Players list ── */}
          {/* ── Players list ── */}
          <div className="mt-8">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "#ea781e",
                }}
              >
                Players
              </div>

              <div
                style={{
                  flex: 1,
                  height: "0.5px",
                  background: "rgba(234,120,30,.15)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  color: "rgba(245,240,232,.4)",
                  fontSize: 12,
                }}
              >
                <Users size={13} />
                {players.length}
              </div>
            </div>

            {players.length === 0 ? (
              <div
                style={{
                  background: "#0d0d0d",
                  border: "0.5px solid rgba(234,120,30,.15)",
                  borderRadius: 16,
                  padding: "2rem",
                  textAlign: "center",
                  color: "rgba(245,240,232,.35)",
                  fontFamily: "Georgia, serif",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at top, rgba(234,120,30,.08), transparent 60%)",
                  }}
                />

                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      fontSize: 42,
                      marginBottom: 14,
                      animation: "floatA 3s ease-in-out infinite",
                    }}
                  >
                    🎮
                  </div>

                  <h3
                    style={{
                      color: "#f5f0e8",
                      fontSize: 18,
                      marginBottom: 6,
                      fontWeight: 500,
                    }}
                  >
                    Waiting for players...
                  </h3>

                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(245,240,232,.35)",
                    }}
                  >
                    Share the lobby code with friends
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                {players.map((player, index) => {
                  const isHost = index === 0;
                  const isCurrentUser = player.id === userId;

                  return (
                    <div
                      key={player.id}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 18,
                        padding: "1rem",
                        background: isHost
                          ? "linear-gradient(135deg, rgba(234,120,30,.18), rgba(13,13,13,1))"
                          : "rgba(13,13,13,.95)",

                        border: isHost
                          ? "1px solid rgba(250,199,117,.35)"
                          : "1px solid rgba(234,120,30,.15)",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",

                        transition: "transform .2s ease, border-color .2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(0)";
                      }}
                    >
                      {/* glow */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: isHost
                            ? "radial-gradient(circle at top right, rgba(250,199,117,.12), transparent 60%)"
                            : "radial-gradient(circle at top right, rgba(234,120,30,.06), transparent 60%)",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            background: isHost
                              ? "radial-gradient(circle at 35% 35%, #FAC775, #ea781e 55%, #7a3a0a)"
                              : "linear-gradient(135deg, rgba(234,120,30,.3), rgba(234,120,30,.1))",

                            border: isHost
                              ? "1px solid rgba(250,199,117,.4)"
                              : "1px solid rgba(234,120,30,.25)",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            color: "#fff",
                            fontSize: 18,
                            fontWeight: 700,

                            boxShadow: isHost
                              ? "0 0 24px rgba(250,199,117,.15)"
                              : "0 0 18px rgba(234,120,30,.08)",
                          }}
                        >
                          {player.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Player Info */}
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <h3
                              style={{
                                color: "#f5f0e8",
                                fontSize: 16,
                                fontWeight: 500,
                                fontFamily: "Georgia, serif",
                              }}
                            >
                              {player.name}
                            </h3>

                            {isCurrentUser && (
                              <span
                                style={{
                                  fontSize: 10,
                                  padding: "3px 8px",
                                  borderRadius: 999,
                                  background: "rgba(59,109,17,.2)",
                                  border: "1px solid rgba(151,196,89,.2)",
                                  color: "#97C459",
                                  letterSpacing: ".08em",
                                  textTransform: "uppercase",
                                }}
                              >
                                You
                              </span>
                            )}
                          </div>

                          <p
                            style={{
                              color: "rgba(245,240,232,.35)",
                              fontSize: 12,
                              marginTop: 4,
                            }}
                          >
                            {isHost ? "Lobby Host" : "Connected Player"}
                          </p>
                        </div>
                      </div>

                      {/* Right side */}
                      <div
                        style={{
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        {isHost ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "6px 12px",
                              borderRadius: 999,
                              background: "rgba(250,199,117,.08)",

                              border: "1px solid rgba(250,199,117,.18)",

                              color: "#FAC775",
                              fontSize: 12,
                            }}
                          >
                            <Crown size={14} />
                            Host
                          </div>
                        ) : (
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: "#22c55e",
                              boxShadow: "0 0 12px rgba(34,197,94,.6)",
                              animation: "qrBlink 1s step-end infinite",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              height: "0.5px",
              background: "rgba(234,120,30,.12)",
              margin: "1.75rem 0",
            }}
          />

          {/* ── Start Quiz button ── */}
          <button
            onClick={startQuiz}
            disabled={quizStarted}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 12,
              background: quizStarted ? "rgba(234,120,30,.2)" : "#ea781e",
              border: "none",
              color: quizStarted ? "rgba(245,240,232,.3)" : "#fff",
              fontSize: 15,
              fontFamily: "Georgia, serif",
              cursor: quizStarted ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: !quizStarted
                ? "0 8px 24px rgba(234,120,30,.25)"
                : "none",
              transition: "background .2s, box-shadow .2s, transform .15s",
            }}
            onMouseEnter={(e) => {
              if (quizStarted) return;
              (e.currentTarget as HTMLButtonElement).style.background =
                "#d46a15";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              if (quizStarted) return;
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ea781e";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            {quizStarted ? (
              <>
                <span
                  style={{
                    animation: "spin 1s linear infinite",
                    display: "inline-block",
                  }}
                >
                  ⟳
                </span>
                Starting Quiz…
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                Start Quiz
              </>
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgba(245,240,232,.25)",
              marginTop: 10,
            }}
          >
            {players.length === 0
              ? "You can start — others will join mid-game"
              : `${players.length} player${players.length > 1 ? "s" : ""} ready`}
          </p>
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
