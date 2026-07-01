"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSocket from "@/hooks/useSocket";
import { socket } from "@/lib/socket/socket";
import { useLobbyStore } from "@/store/lobbyStore";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { Eye, Trophy, Copy, Crown } from "lucide-react";
import { Spectator } from "@/types/socket";

interface Props {
  lobbyId: string;
}

export default function QuizLobbyClient({ lobbyId }: Props) {
  const { data: session, status } = useSession();
  const userId = session?.user?.email ?? "";

  const setPlayers = useLobbyStore((s) => s.setPlayers);
  const leaderboard = useLeaderboardStore((s) => s.leaderboard);
  const setLeaderboard = useLeaderboardStore((s) => s.setLeaderboard);
  const setSpectators = useLobbyStore((s) => s.setSpectators);

  // spectators
  useEffect(() => {
    socket.on("spectators-update", (data: Spectator[]) => {
      setSpectators(data);
    });
    return () => {
      socket.off("spectators-update");
    };
  }, [setSpectators]);

  // must-spectate
  useEffect(() => {
    socket.on("must-spectate", () => {
      joinAsSpectator();
    });
    return () => {
      socket.off("must-spectate");
    };
  }, []);

  useSocket({
    lobbyId,
    userId: status === "authenticated" ? userId : "",
    playerName: session?.user?.name ?? "Player",
  });

  // players-update
  useEffect(() => {
    socket.on("players-update", (data: any) => setPlayers(data));
    return () => {
      socket.off("players-update");
    };
  }, [setPlayers]);

  // leaderboard-update
  useEffect(() => {
    socket.on("leaderboard-update", (data: any) => setLeaderboard(data));
    return () => {
      socket.off("leaderboard-update");
    };
  }, [setLeaderboard]);

  if (!session?.user) {
    return (
      <div
        style={{
          padding: "1rem 1.5rem",
          borderRadius: 12,
          background: "rgba(163,45,45,.12)",
          border: "0.5px solid rgba(163,45,45,.3)",
          color: "#F09595",
          fontSize: 13,
          fontFamily: "Georgia, serif",
          marginBottom: 16,
        }}
      >
        User not found
      </div>
    );
  }

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/lobby/${lobbyId}`,
      );
      alert("Invite link copied!");
    } catch (err) {
      console.error("COPY FAILED:", err);
    }
  }

  function joinAsSpectator() {
    socket.emit("join-spectator", {
      lobbyId,
      spectator: {
        id: userId,
        name: session?.user?.name ?? "Spectator",
        socketId: socket.id,
      },
    });
  }

  const medalColor = (i: number) =>
    i === 0
      ? "#FAC775"
      : i === 1
        ? "#B4B2A9"
        : i === 2
          ? "#BA7517"
          : "rgba(245,240,232,.35)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 24,
      }}
    >
      {/* ── Lobby header card ── */}
      <div
        style={{
          borderRadius: 14,
          background: "rgba(234,120,30,.06)",
          border: "0.5px solid rgba(234,120,30,.2)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#ea781e",
              marginBottom: 4,
            }}
          >
            QuizRush — Lobby
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 20,
              fontWeight: 400,
              color: "#f5f0e8",
              lineHeight: 1.2,
            }}
          >
            Quiz{" "}
            <span style={{ color: "#ea781e", fontStyle: "italic" }}>Lobby</span>
          </h1>
        </div>

        {/* Lobby code */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 3,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,.35)",
            }}
          >
            Lobby Code
          </span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 18,
              color: "#ea781e",
              letterSpacing: ".1em",
            }}
          >
            {lobbyId}
          </span>
        </div>
      </div>

      {/* ── Leaderboard card ── */}
      <div
        style={{
          borderRadius: 14,
          background: "rgba(13,13,13,.88)",
          border: "0.5px solid rgba(234,120,30,.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderBottom: "0.5px solid rgba(234,120,30,.1)",
            background: "rgba(234,120,30,.05)",
          }}
        >
          <Trophy size={14} style={{ color: "#ea781e" }} />
          <span
            style={{
              fontSize: 11,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "#ea781e",
            }}
          >
            Leaderboard
          </span>
          <span
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              color: "#ea781e",
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#ea781e",
                display: "inline-block",
                animation: "qrBlink 1s step-end infinite",
              }}
            />
            Live
          </span>
        </div>

        {/* List */}
        <div style={{ padding: "8px 0" }}>
          {leaderboard.length === 0 ? (
            <div
              style={{
                padding: "1.25rem 1.5rem",
                textAlign: "center",
                color: "rgba(245,240,232,.3)",
                fontSize: 13,
                fontFamily: "Georgia, serif",
              }}
            >
              No scores yet
            </div>
          ) : (
            leaderboard.map((p: any, i: number) => (
              <div
                key={p.id ?? i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 16px",
                  borderBottom:
                    i < leaderboard.length - 1
                      ? "0.5px solid rgba(245,240,232,.04)"
                      : "none",
                  transition: "background .15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(234,120,30,.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "transparent";
                }}
              >
                {/* Rank */}
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "Georgia, serif",
                    color: medalColor(i),
                    width: 18,
                    flexShrink: 0,
                    fontWeight: i < 3 ? 600 : 400,
                  }}
                >
                  {i + 1}
                </span>

                {/* Avatar */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      i === 0
                        ? "rgba(250,199,117,.15)"
                        : i === 1
                          ? "rgba(180,178,169,.1)"
                          : i === 2
                            ? "rgba(186,117,23,.12)"
                            : "rgba(234,120,30,.08)",
                    border: `0.5px solid ${medalColor(i)}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: medalColor(i),
                    fontWeight: 600,
                  }}
                >
                  {(p.name ?? "P").charAt(0).toUpperCase()}
                </div>

                {/* Name + host crown */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "Georgia, serif",
                      color: "#f5f0e8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.name}
                  </span>
                  {i === 0 && (
                    <Crown
                      size={12}
                      style={{ color: "#FAC775", flexShrink: 0 }}
                    />
                  )}
                </div>

                {/* Score column */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                  }}
                >
                  {/* Correct answers chip */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 8px",
                      borderRadius: 100,
                      background: "rgba(245,240,232,.04)",
                      border: "0.5px solid rgba(245,240,232,.08)",
                      fontSize: 11,
                      color: "rgba(245,240,232,.45)",
                      fontFamily: "Georgia, serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.correctAnswers ?? 0}/10
                  </div>

                  {/* Speed bonus chip */}

                  {(p.bonus ?? 0) > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 8px",
                        borderRadius: 100,
                        background: "rgba(87,255,138,.1)",
                        border: "0.5px solid rgba(87,255,138,.25)",
                        fontSize: 11,
                        color: "#57ff8a",
                        fontFamily: "Georgia, serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⭐ +{p.bonus} {p.bonusLabel}
                    </div>
                  )}

                  {/* Score pill */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      minWidth: 56,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 17,
                        fontFamily: "Georgia, serif",
                        color: "#ea781e",
                        fontWeight: 600,
                        lineHeight: 1,
                      }}
                    >
                      {p.score}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        color: "rgba(245,240,232,.3)",
                        marginTop: 2,
                      }}
                    >
                      pts
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {/* Copy invite */}
        <button
          onClick={copyInvite}
          style={{
            flex: 1,
            minWidth: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            padding: "10px 16px",
            borderRadius: 10,
            background: "rgba(234,120,30,.12)",
            border: "0.5px solid rgba(234,120,30,.3)",
            color: "#ea781e",
            fontSize: 13,
            fontFamily: "Georgia, serif",
            cursor: "pointer",
            transition: "background .2s, transform .15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(234,120,30,.22)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(234,120,30,.12)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(0)";
          }}
        >
          <Copy size={13} /> Copy Invite Link
        </button>

        {/* Spectator */}
        <button
          onClick={joinAsSpectator}
          style={{
            flex: 1,
            minWidth: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            padding: "10px 16px",
            borderRadius: 10,
            background: "rgba(96,184,245,.08)",
            border: "0.5px solid rgba(96,184,245,.25)",
            color: "#60b8f5",
            fontSize: 13,
            fontFamily: "Georgia, serif",
            cursor: "pointer",
            transition: "background .2s, transform .15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(96,184,245,.16)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(96,184,245,.08)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(0)";
          }}
        >
          <Eye size={13} /> Watch as Spectator
        </button>
      </div>

      <style>{`
        @keyframes qrBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes qrPulse  { 0%{transform:translateY(4px);opacity:0} 50%{transform:translateY(0);opacity:1} 100%{transform:translateY(-4px);opacity:0} }
      `}</style>
    </div>
  );
}
