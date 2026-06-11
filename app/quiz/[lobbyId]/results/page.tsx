"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Trophy, Home, RotateCcw, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const score = Number(searchParams.get("score") || "0");
  const total = Number(searchParams.get("total") || "0");
  const lobbyId = params.lobbyId as string;

  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(`review-${lobbyId}`);

    if (saved) {
      setReviewData(JSON.parse(saved));
    }
  }, [lobbyId]);

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const getMessage = () => {
    if (pct >= 80)
      return {
        text: "Excellent!",
        sub: "You crushed it — top of the leaderboard material.",
      };
    if (pct >= 60)
      return {
        text: "Good effort!",
        sub: "Solid performance. A few more rounds and you'll dominate.",
      };
    if (pct >= 40)
      return {
        text: "Keep going!",
        sub: "You're getting there. Practice makes perfect.",
      };
    return {
      emoji: "📚",
      text: "Keep practising!",
      sub: "Every question is a lesson. Come back stronger.",
    };
  };

  const { emoji, text, sub } = getMessage();
  const barColor =
    pct >= 80
      ? "#3B6D11"
      : pct >= 60
        ? "#ea781e"
        : pct >= 40
          ? "#BA7517"
          : "#A32D2D";

  return (
    <main
      className="relative min-h-screen overflow-x-hidden flex items-center justify-center p-6"
      style={{ background: "#0a0a0a" }}
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

      {/*  CARD  */}
      <div className="relative w-full" style={{ zIndex: 10, maxWidth: 480 }}>
        {/* Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(234,120,30,.1)",
              border: "0.5px solid rgba(234,120,30,.35)",
              borderRadius: 100,
              padding: "5px 16px",
              fontSize: 10,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "#ea781e",
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
            QuizRush — Results
          </div>
        </div>

        {/* Main card */}
        <div
          style={{
            borderRadius: 20,
            background: "rgba(13,13,13,.92)",
            backdropFilter: "blur(24px)",
            border: "0.5px solid rgba(234,120,30,.2)",
            boxShadow:
              "0 0 0 0.5px rgba(234,120,30,.08), 0 40px 80px rgba(0,0,0,.6)",
            overflow: "hidden",
          }}
        >
          {/* Top accent strip */}
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg, transparent, ${barColor}, transparent)`,
            }}
          />

          <div style={{ padding: "2.5rem 2rem" }}>
            {/* Trophy orb */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.75rem",
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 0 0 1px rgba(234,120,30,.4), 0 0 0 8px rgba(234,120,30,.08), 0 16px 40px rgba(234,120,30,.28)",
                  animation: "floatA 5s ease-in-out infinite",
                }}
              >
                <Trophy size={38} color="#fff" />
              </div>
            </div>

            {/* Score */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontSize: "clamp(3rem, 10vw, 4.5rem)",
                  fontFamily: "Georgia, serif",
                  fontWeight: 400,
                  color: "#ea781e",
                  lineHeight: 1,
                }}
              >
                {score}
                <span
                  style={{
                    fontSize: "35%",
                    color: "rgba(245,240,232,.35)",
                    letterSpacing: ".04em",
                  }}
                >
                  {" "}
                  / {total}
                </span>
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  fontFamily: "Georgia, serif",
                  color: "#f5f0e8",
                }}
              >
                {emoji} {text}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: "rgba(245,240,232,.45)",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1.6,
                }}
              >
                {sub}
              </div>
            </div>

            {/* Score bar */}
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
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
                  Accuracy
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: barColor,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {pct}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(245,240,232,.07)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: barColor,
                    borderRadius: 3,
                    transition: "width 1.2s ease",
                    boxShadow: `0 0 8px ${barColor}60`,
                  }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginBottom: "2rem",
              }}
            >
              {[
                {
                  label: "Correct",
                  value: score,
                  color: "#97C459",
                  bg: "rgba(59,109,17,.12)",
                  border: "rgba(59,109,17,.25)",
                },
                {
                  label: "Wrong",
                  value: total - score,
                  color: "#F09595",
                  bg: "rgba(163,45,45,.12)",
                  border: "rgba(163,45,45,.25)",
                },
                {
                  label: "Total",
                  value: total,
                  color: "#ea781e",
                  bg: "rgba(234,120,30,.08)",
                  border: "rgba(234,120,30,.2)",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: stat.bg,
                    border: `0.5px solid ${stat.border}`,
                    borderRadius: 10,
                    padding: "12px 8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontFamily: "Georgia, serif",
                      color: stat.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(245,240,232,.4)",
                      marginTop: 4,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: "0.5px",
                background: "rgba(234,120,30,.15)",
                marginBottom: "1.5rem",
              }}
            />

            {/* Question Review */}
            {reviewData.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                {/* HEADER ONCE */}
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#ea781e",
                    marginBottom: 14,
                  }}
                >
                  Question Review
                </div>

                {/* LIST */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    maxHeight: 400,
                    overflowY: "auto",
                  }}
                >
                  {reviewData.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        background: "rgba(245,240,232,.03)",
                        border: `1px solid ${
                          item.isCorrect
                            ? "rgba(59,109,17,.4)"
                            : "rgba(163,45,45,.4)"
                        }`,
                        borderRadius: 12,
                        padding: "14px",
                      }}
                    >
                      <div
                        style={{
                          color: "#f5f0e8",
                          marginBottom: 10,
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        Q{index + 1}. {item.question}
                      </div>

                      <div
                        style={{
                          color: item.isCorrect ? "#97C459" : "#F09595",
                          fontSize: 13,
                          marginBottom: 6,
                        }}
                      >
                        Your Answer: {item.userAnswer}
                      </div>

                      <div
                        style={{
                          color: "#ea781e",
                          fontSize: 13,
                        }}
                      >
                        Correct Answer: {item.correctAnswer}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          background: item.isCorrect
                            ? "rgba(59,109,17,.15)"
                            : "rgba(163,45,45,.15)",
                          color: item.isCorrect ? "#97C459" : "#F09595",
                        }}
                      >
                        {item.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => router.push(`/lobby/${lobbyId}`)}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 10,
                  background: "#ea781e",
                  border: "none",
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 8px 24px rgba(234,120,30,.25)",
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
                <Users size={15} /> Back to Lobby
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => router.push("/home")}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: 10,
                    background: "transparent",
                    border: "0.5px solid rgba(234,120,30,.25)",
                    color: "rgba(245,240,232,.6)",
                    fontSize: 13,
                    fontFamily: "Georgia, serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    transition:
                      "background .2s, border-color .2s, transform .15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(234,120,30,.07)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(234,120,30,.5)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#f5f0e8";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(234,120,30,.25)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(245,240,232,.6)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <Home size={13} /> Home
                </button>

                <button
                  onClick={() => router.push(`/lobby/${lobbyId}`)}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: 10,
                    background: "transparent",
                    border: "0.5px solid rgba(234,120,30,.25)",
                    color: "rgba(245,240,232,.6)",
                    fontSize: 13,
                    fontFamily: "Georgia, serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    transition:
                      "background .2s, border-color .2s, transform .15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(234,120,30,.07)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(234,120,30,.5)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#f5f0e8";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(234,120,30,.25)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(245,240,232,.6)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <RotateCcw size={14} /> Play Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 11,
            color: "rgba(245,240,232,.18)",
            fontFamily: "Georgia, serif",
          }}
        >
          Room · {lobbyId}
        </p>
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
