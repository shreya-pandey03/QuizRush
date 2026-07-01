"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Gamepad2, Star, Target, Trophy } from "lucide-react";

type Stats = {
  gamesPlayed: number;
  totalScore: number;
  accuracy: number;
  winRate: number;
};

export default function StatsPage() {
  const { data: session } = useSession();

  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalScore: 0,
    accuracy: 0,
    winRate: 0,
  });

  useEffect(() => {
    async function loadStats() {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `/api/user-stats?userId=${encodeURIComponent(session.user.email)}`,
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        console.log("USER STATS:", data);
        setStats({
          gamesPlayed: data.gamesPlayed ?? 0,
          totalScore: data.totalScore ?? 0,
          accuracy: data.accuracy ?? 0,
          winRate: data.winRate ?? 0,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    }
    loadStats();
  }, [session]);

  const cards = [
    {
      label: "Games Played",
      value: stats.gamesPlayed,
      icon: <Gamepad2 size={20} />,
      suffix: "",
      color: "#ea781e",
      bg: "rgba(234,120,30,.08)",
      border: "rgba(234,120,30,.25)",
    },
    {
      label: "Total Score",
      value: stats.totalScore,
      icon: <Star size={20} />,
      suffix: "",
      color: "#FAC775",
      bg: "rgba(250,199,117,.08)",
      border: "rgba(250,199,117,.25)",
    },
    {
      label: "Accuracy",
      value: stats.accuracy,
      icon: <Target size={20} />,
      suffix: "%",
      color: "#97C459",
      bg: "rgba(59,109,17,.1)",
      border: "rgba(59,109,17,.28)",
    },
    {
      label: "Win Rate",
      value: stats.winRate,
      icon: <Trophy size={20} />,
      suffix: "%",
      color: "#ea781e",
      bg: "rgba(234,120,30,.08)",
      border: "rgba(234,120,30,.25)",
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
      <div className="relative mx-auto" style={{ zIndex: 10, maxWidth: 860 }}>
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
              Analyze your progress and improve your ranking.
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
                  {session.user.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Stat cards ── */}
        <div className="grid md:grid-cols-2 gap-4" style={{ marginBottom: 32 }}>
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* ── Performance bar section ── */}
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
              {
                label: "Accuracy",
                value: stats.accuracy,
                color: "#97C459",
                trackColor: "rgba(59,109,17,.15)",
              },
              {
                label: "Win Rate",
                value: stats.winRate,
                color: "#ea781e",
                trackColor: "rgba(234,120,30,.1)",
              },
            ].map((bar) => (
              <div key={bar.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
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

            {/* Games vs Score ratio */}
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
                gap: 16,
              }}
            >
              {[
                {
                  label: "Avg. Score per Game",
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
                      fontSize: 11,
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

function StatCard({
  label,
  value,
  suffix,
  icon,
  color,
  bg,
  border,
}: {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "rgba(13,13,13,.88)",
        backdropFilter: "blur(20px)",
        border: "0.5px solid rgba(234,120,30,.15)",
        padding: "1.75rem 2rem",
        transition: "border-color .2s, background .2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${border}`;
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(234,120,30,.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(234,120,30,.15)";
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(13,13,13,.88)";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: bg,
          border: `0.5px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <p
        style={{
          fontSize: 11,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "rgba(245,240,232,.4)",
          marginBottom: 8,
        }}
      >
        {label}
      </p>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            fontWeight: 400,
            fontFamily: "Georgia, serif",
            color,
            lineHeight: 1,
          }}
        >
          {value}
        </h2>
        {suffix && (
          <span
            style={{
              fontSize: 16,
              color,
              opacity: 0.6,
              fontFamily: "Georgia, serif",
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          height: 2,
          background: "rgba(245,240,232,.05)",
          borderRadius: 1,
          marginTop: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: suffix ? `${Math.min(value, 100)}%` : "100%",
            background: color,
            opacity: 0.4,
            borderRadius: 1,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}
