"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Gamepad2, Star, Target, Trophy, Zap, Shield } from "lucide-react";

type Stats = {
  gamesPlayed: number;
  totalScore: number;
  accuracy: number;
  winRate: number;
  xp: number;
  level: number;
};

export default function StatsPage() {
  const { data: session } = useSession();

  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalScore: 0,
    accuracy: 0,
    winRate: 0,
    xp: 0,
    level: 1,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `/api/user-stats?userId=${encodeURIComponent(session.user.email)}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("USER STATS:", data);
        setStats({
          gamesPlayed: data.gamesPlayed ?? 0,
          totalScore: data.totalScore ?? 0,
          accuracy: data.accuracy ?? 0,
          winRate: data.winRate ?? 0,
          xp: data.xp ?? 0,
          level: Math.floor((data.xp ?? 0) / 1000) + 1,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    loadStats();
  }, [session]);

  // XP progress within current level (assume 1000 XP per level)
  const xpPerLevel = 1000;
  const xpProgress = stats.xp % xpPerLevel;
  const xpPct = Math.min(100, Math.round((xpProgress / xpPerLevel) * 100));

  const cards = [
    {
      label: "Games Played",
      value: stats.gamesPlayed,
      suffix: "",
      icon: <Gamepad2 size={18} />,
      color: "#ea781e",
      bg: "rgba(234,120,30,.1)",
      border: "rgba(234,120,30,.28)",
    },
    {
      label: "Total Score",
      value: stats.totalScore,
      suffix: "",
      icon: <Star size={18} />,
      color: "#FAC775",
      bg: "rgba(250,199,117,.1)",
      border: "rgba(250,199,117,.28)",
    },
    {
      label: "Accuracy",
      value: stats.accuracy,
      suffix: "%",
      icon: <Target size={18} />,
      color: "#97C459",
      bg: "rgba(59,109,17,.12)",
      border: "rgba(59,109,17,.3)",
    },
    {
      label: "Win Rate",
      value: stats.winRate,
      suffix: "%",
      icon: <Trophy size={18} />,
      color: "#ea781e",
      bg: "rgba(234,120,30,.1)",
      border: "rgba(234,120,30,.28)",
    },
    {
      label: "XP Points",
      value: stats.xp,
      suffix: "",
      icon: <Zap size={18} />,
      color: "#c084fc",
      bg: "rgba(192,132,252,.1)",
      border: "rgba(192,132,252,.28)",
    },
    {
      label: "Level",
      value: stats.level,
      suffix: "",
      icon: <Shield size={18} />,
      color: "#60b8f5",
      bg: "rgba(96,184,245,.1)",
      border: "rgba(96,184,245,.28)",
    },
  ];

  return (
    <main
      className="relative min-h-screen overflow-x-hidden p-8"
      style={{ background: "#0a0a0a", color: "#f5f0e8" }}
    >
      {/* ── Grid ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(234,120,30,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(234,120,30,.055) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />
      {/* ── Top glow ── */}
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
          top: 0,
          background:
            "linear-gradient(90deg, transparent, rgba(234,120,30,.25), transparent)",
          animation: "qrScan 6s linear infinite",
          zIndex: 1,
        }}
      />
      {/* ── Orbs ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "18%",
          left: "4%",
          width: 76,
          height: 76,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.3), 0 0 34px rgba(234,120,30,.18)",
          animation: "floatA 8s ease-in-out infinite",
          opacity: 0.42,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "58%",
          right: "4%",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          animation: "floatB 10s ease-in-out infinite",
          opacity: 0.38,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "18%",
          left: "8%",
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.4)",
          animation: "floatC 6s ease-in-out infinite",
          opacity: 0.5,
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
          border: "1px solid rgba(234,120,30,.3)",
          animation: "floatA 7s ease-in-out infinite",
          opacity: 0.45,
          zIndex: 0,
        }}
      />
      {/* ── Rings ── */}
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
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.11)",
          animation: "spinRing 16s linear infinite reverse",
          zIndex: 0,
        }}
      />

      {/* ══ CONTENT ══ */}
      <div className="relative mx-auto" style={{ zIndex: 10, maxWidth: 900 }}>
        {/* ── Header ── */}
        <div
          className="flex items-start justify-between flex-wrap gap-4 pb-6 mb-8"
          style={{ borderBottom: "0.5px solid rgba(234,120,30,.15)" }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#ea781e" }}>⚡</span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#ea781e",
                }}
              >
                QuizRush — Statistics
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
              Performance{" "}
              <span style={{ color: "#ea781e", fontStyle: "italic" }}>
                Overview
              </span>
            </h1>
            <p
              style={{
                color: "rgba(245,240,232,.45)",
                marginTop: 8,
                fontSize: 14,
                fontFamily: "Georgia, serif",
              }}
            >
              Track your overall quiz performance and progress.
            </p>
          </div>

          {/* Player pill */}
          {session?.user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px 8px 8px",
                borderRadius: 100,
                background: "rgba(234,120,30,.07)",
                border: "0.5px solid rgba(234,120,30,.2)",
                alignSelf: "flex-start",
              }}
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="avatar"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: "1px solid rgba(234,120,30,.35)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {session.user.name?.charAt(0).toUpperCase() ?? "P"}
                </div>
              )}
              <div>
                <p
                  style={{
                    color: "#f5f0e8",
                    fontSize: 13,
                    fontFamily: "Georgia, serif",
                    lineHeight: 1.2,
                  }}
                >
                  {session.user.name}
                </p>
                <p style={{ color: "rgba(245,240,232,.35)", fontSize: 11 }}>
                  Lv. {stats.level} · {stats.xp} XP
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── XP / Level banner ── */}
        <div
          style={{
            borderRadius: 16,
            background: "rgba(13,13,13,.9)",
            backdropFilter: "blur(20px)",
            border: "0.5px solid rgba(192,132,252,.2)",
            padding: "1.5rem 2rem",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Level orb */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 35%, #d8b4fe, #c084fc 55%, #6b21a8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 0 1px rgba(192,132,252,.4), 0 0 20px rgba(192,132,252,.2)",
              flexShrink: 0,
              animation: "floatA 6s ease-in-out infinite",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 20,
                color: "#fff",
                fontWeight: 400,
              }}
            >
              {stats.level}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "rgba(192,132,252,.7)",
                  }}
                >
                  Level {stats.level}
                </span>
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    color: "#f5f0e8",
                    marginTop: 2,
                  }}
                >
                  {xpProgress}{" "}
                  <span
                    style={{ fontSize: "60%", color: "rgba(245,240,232,.35)" }}
                  >
                    / {xpPerLevel} XP
                  </span>
                </p>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: "#c084fc",
                  fontFamily: "Georgia, serif",
                  alignSelf: "flex-end",
                }}
              >
                {xpPct}%
              </span>
            </div>
            {/* XP bar */}
            <div
              style={{
                height: 6,
                background: "rgba(192,132,252,.1)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${xpPct}%`,
                  background: "linear-gradient(90deg, #c084fc, #a855f7)",
                  borderRadius: 3,
                  transition: "width 1.2s ease",
                  boxShadow: "0 0 8px rgba(192,132,252,.4)",
                }}
              />
            </div>
            <p
              style={{
                fontSize: 11,
                color: "rgba(245,240,232,.3)",
                marginTop: 6,
              }}
            >
              {xpPerLevel - xpProgress} XP to level {stats.level + 1}
            </p>
          </div>

          <div
            style={{
              height: "0.5px",
              width: "100%",
              background: "rgba(192,132,252,.1)",
            }}
          />

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "rgba(192,132,252,.6)",
                  marginBottom: 4,
                }}
              >
                Total XP
              </p>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 20,
                  color: "#c084fc",
                }}
              >
                {stats.xp}
              </p>
            </div>
            <div
              style={{
                width: "0.5px",
                background: "rgba(192,132,252,.15)",
                alignSelf: "stretch",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "rgba(192,132,252,.6)",
                  marginBottom: 4,
                }}
              >
                Current Level
              </p>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 20,
                  color: "#c084fc",
                }}
              >
                {stats.level}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat cards (6) ── */}
        <div className="grid md:grid-cols-3 gap-4" style={{ marginBottom: 20 }}>
          {cards.map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 14,
                background: "rgba(13,13,13,.88)",
                backdropFilter: "blur(20px)",
                border: "0.5px solid rgba(234,120,30,.15)",
                padding: "1.5rem",
                transition: "border-color .2s, background .2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  card.border;
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(234,120,30,.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(234,120,30,.15)";
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(13,13,13,.88)";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9,
                  background: card.bg,
                  border: `0.5px solid ${card.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                  marginBottom: 14,
                }}
              >
                {card.icon}
              </div>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,.4)",
                  marginBottom: 6,
                }}
              >
                {card.label}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                    fontWeight: 400,
                    fontFamily: "Georgia, serif",
                    color: card.color,
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </h2>
                {card.suffix && (
                  <span
                    style={{ fontSize: 14, color: card.color, opacity: 0.6 }}
                  >
                    {card.suffix}
                  </span>
                )}
              </div>
              {/* Bottom accent */}
              <div
                style={{
                  height: 2,
                  background: "rgba(245,240,232,.05)",
                  borderRadius: 1,
                  marginTop: 14,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: card.suffix
                      ? `${Math.min(Number(card.value), 100)}%`
                      : "100%",
                    background: card.color,
                    opacity: 0.35,
                    borderRadius: 1,
                    transition: "width 1s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Performance bars ── */}
        <div
          style={{
            borderRadius: 16,
            background: "rgba(13,13,13,.88)",
            backdropFilter: "blur(20px)",
            border: "0.5px solid rgba(234,120,30,.15)",
            padding: "1.75rem 2rem",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: ".13em",
              textTransform: "uppercase",
              color: "#ea781e",
              marginBottom: 20,
            }}
          >
            Performance Breakdown
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { label: "Accuracy", value: stats.accuracy, color: "#97C459" },
              { label: "Win Rate", value: stats.winRate, color: "#ea781e" },
            ].map((bar) => (
              <div key={bar.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 7,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "Georgia, serif",
                      color: "rgba(245,240,232,.6)",
                    }}
                  >
                    {bar.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "Georgia, serif",
                      color: bar.color,
                    }}
                  >
                    {bar.value}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "rgba(245,240,232,.06)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(bar.value, 100)}%`,
                      background: bar.color,
                      borderRadius: 3,
                      transition: "width 1.2s ease",
                      boxShadow: `0 0 8px ${bar.color}50`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div
              style={{
                height: "0.5px",
                background: "rgba(234,120,30,.12)",
                margin: "4px 0",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  label: "Avg. Score / Game",
                  value:
                    stats.gamesPlayed > 0
                      ? (stats.totalScore / stats.gamesPlayed).toFixed(1)
                      : "0.0",
                  color: "#FAC775",
                },
                {
                  label: "Total Games",
                  value: stats.gamesPlayed,
                  color: "#ea781e",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(234,120,30,.05)",
                    border: "0.5px solid rgba(234,120,30,.12)",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(245,240,232,.35)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: 22,
                      fontFamily: "Georgia, serif",
                      color: item.color,
                      lineHeight: 1,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes qrScan    { 0%{top:-2%} 100%{top:102%} }
        @keyframes qrBlink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatA    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatB    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes floatC    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spinRing  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </main>
  );
}
