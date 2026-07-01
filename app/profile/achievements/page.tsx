"use client";

import { useEffect, useState } from "react";

type BadgeKey = "perfect" | "quiz_master" | "good_try" | "practice_mode";

const BADGES: Record<
  string,
  {
    title: string;
    description: string;
    emoji: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  perfect: {
    title: "Perfect Score",
    description: "You answered all questions correctly.",
    emoji: "🏆",
    color: "#FAC775",
    bg: "rgba(250,199,117,.12)",
    border: "rgba(250,199,117,.3)",
  },
  quiz_master: {
    title: "Quiz Master",
    description: "You scored 80% or higher.",
    emoji: "⚡",
    color: "#ea781e",
    bg: "rgba(234,120,30,.12)",
    border: "rgba(234,120,30,.3)",
  },
  good_try: {
    title: "Good Try",
    description: "You scored 50% or higher. Keep improving!",
    emoji: "👍",
    color: "#60b8f5",
    bg: "rgba(96,184,245,.1)",
    border: "rgba(96,184,245,.28)",
  },
  practice_mode: {
    title: "Practice Mode",
    description: "Keep practising to improve your score.",
    emoji: "💪",
    color: "#97C459",
    bg: "rgba(59,109,17,.12)",
    border: "rgba(59,109,17,.3)",
  },
};

function getBadge(key: string) {
  return (
    BADGES[key] ?? {
      title: key,
      description: "Achievement unlocked through gameplay.",
      emoji: "★",
      color: "#ea781e",
      bg: "rgba(234,120,30,.1)",
      border: "rgba(234,120,30,.25)",
    }
  );
}

export default function AchievementsPage() {
  const [badges, setBadges] = useState<BadgeKey[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("achievements");
      setBadges(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error("Failed to load achievements", err);
      setBadges([]);
    }
  }, []);

  // all possible badges for the "locked" preview
  const ALL_KEYS = Object.keys(BADGES) as BadgeKey[];
  const lockedBadges = ALL_KEYS.filter((k) => !badges.includes(k));

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
                QuizRush — Achievements
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
              Your{" "}
              <span style={{ color: "#ea781e", fontStyle: "italic" }}>
                Badges
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
              Unlock achievements by winning games and scoring high.
            </p>
          </div>

          {/* Count pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(234,120,30,.1)",
              border: "0.5px solid rgba(234,120,30,.3)",
              borderRadius: 100,
              padding: "7px 16px",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontFamily: "Georgia, serif",
                color: "#ea781e",
              }}
            >
              {badges.length}
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,.45)",
              }}
            >
              / {ALL_KEYS.length} unlocked
            </span>
          </div>
        </div>

        {/* ── Empty state ── */}
        {badges.length === 0 && (
          <div
            style={{
              borderRadius: 16,
              background: "rgba(13,13,13,.88)",
              backdropFilter: "blur(20px)",
              border: "0.5px solid rgba(234,120,30,.15)",
              padding: "3.5rem 2rem",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(234,120,30,.1)",
                border: "0.5px solid rgba(234,120,30,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 28,
              }}
            >
              🏅
            </div>
            <h3
              style={{
                color: "#f5f0e8",
                fontSize: 18,
                fontFamily: "Georgia, serif",
                marginBottom: 8,
              }}
            >
              No Achievements Yet
            </h3>
            <p
              style={{
                color: "rgba(245,240,232,.4)",
                fontSize: 13,
                fontFamily: "Georgia, serif",
              }}
            >
              Play more quizzes to unlock badges.
            </p>
          </div>
        )}

        {/* ── Unlocked badges ── */}
        {badges.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "#ea781e",
                }}
              >
                Unlocked
              </span>
              <div
                style={{
                  flex: 1,
                  height: "0.5px",
                  background: "rgba(234,120,30,.15)",
                }}
              />
            </div>

            <div
              className="grid md:grid-cols-2 gap-4"
              style={{ marginBottom: 28 }}
            >
              {badges.map((key, index) => {
                const b = getBadge(key);
                return (
                  <div
                    key={index}
                    style={{
                      borderRadius: 14,
                      background: "rgba(13,13,13,.9)",
                      backdropFilter: "blur(20px)",
                      border: `0.5px solid ${b.border}`,
                      overflow: "hidden",
                      transition: "transform .2s, border-color .2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    {/* Top colour strip */}
                    <div
                      style={{
                        height: 3,
                        background: `linear-gradient(90deg, transparent, ${b.color}, transparent)`,
                      }}
                    />

                    <div style={{ padding: "1.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        {/* Badge orb */}
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: b.bg,
                            border: `1px solid ${b.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            boxShadow: `0 0 16px ${b.color}30`,
                            animation: "floatA 5s ease-in-out infinite",
                          }}
                        >
                          {b.emoji}
                        </div>

                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 4,
                            }}
                          >
                            <h3
                              style={{
                                fontSize: 16,
                                fontFamily: "Georgia, serif",
                                color: "#f5f0e8",
                              }}
                            >
                              {b.title}
                            </h3>
                            <span
                              style={{
                                fontSize: 10,
                                letterSpacing: ".1em",
                                textTransform: "uppercase",
                                color: b.color,
                                background: b.bg,
                                border: `0.5px solid ${b.border}`,
                                borderRadius: 100,
                                padding: "2px 8px",
                              }}
                            >
                              Earned
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: 13,
                              color: "rgba(245,240,232,.45)",
                              fontFamily: "Georgia, serif",
                              lineHeight: 1.5,
                            }}
                          >
                            {b.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Locked badges ── */}
        {lockedBadges.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,.3)",
                }}
              >
                Locked
              </span>
              <div
                style={{
                  flex: 1,
                  height: "0.5px",
                  background: "rgba(245,240,232,.08)",
                }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {lockedBadges.map((key) => {
                const b = getBadge(key);
                return (
                  <div
                    key={key}
                    style={{
                      borderRadius: 14,
                      background: "rgba(13,13,13,.6)",
                      border: "0.5px solid rgba(245,240,232,.06)",
                      padding: "1.5rem",
                      opacity: 0.55,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      {/* Locked orb */}
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: "rgba(245,240,232,.04)",
                          border: "1px solid rgba(245,240,232,.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                        }}
                      >
                        🔒
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: 16,
                            fontFamily: "Georgia, serif",
                            color: "rgba(245,240,232,.4)",
                            marginBottom: 4,
                          }}
                        >
                          {b.title}
                        </h3>
                        <p
                          style={{
                            fontSize: 13,
                            color: "rgba(245,240,232,.25)",
                            fontFamily: "Georgia, serif",
                            lineHeight: 1.5,
                          }}
                        >
                          {b.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
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
