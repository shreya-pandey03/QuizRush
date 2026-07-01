"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Home,
  RotateCcw,
  Users,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

type ReviewItem = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  userAnswerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();

  const lobbyId = params.lobbyId as string;

  const [reviewData, setReviewData] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lobbyId) return;
    const data = localStorage.getItem(`review-${lobbyId}`);
    if (data) {
      try {
        setReviewData(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse review data:", error);
      }
    }
    setLoading(false);
  }, [lobbyId]);

  const score = reviewData.filter((q) => q.isCorrect).length;
  const total = reviewData.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  useEffect(() => {
    if (total === 0) return;
    const unlocked: string[] = [];
    if (score === total) {
      unlocked.push("perfect");
    }
    if (pct >= 80) {
      unlocked.push("quiz_master");
    }
    if (pct >= 50) {
      unlocked.push("good_try");
    }
    if (pct < 50) {
      unlocked.push("practice_mode");
    }
    const existing = JSON.parse(localStorage.getItem("achievements") || "[]");
    const merged = [...new Set([...existing, ...unlocked])];
    localStorage.setItem("achievements", JSON.stringify(merged));
  }, [score, total, pct]);

  if (loading) {
    return <div>Loading Results...</div>;
  }
  const getMessage = () => {
    if (pct >= 80) {
      return {
        text: "Excellent!",
        sub: "You crushed it — top of the leaderboard material.",
      };
    }

    if (pct >= 60) {
      return {
        text: "Good effort!",
        sub: "Solid performance. A few more rounds and you'll dominate.",
      };
    }

    if (pct >= 40) {
      return {
        text: "Keep going!",
        sub: "You're getting there. Practice makes perfect.",
      };
    }

    return {
      text: "Keep practising!",
      sub: "Every question is a lesson. Come back stronger.",
    };
  };

  const { text, sub } = getMessage();

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
      className="relative min-h-screen overflow-x-hidden p-1"
      style={{ background: "#0a0a0a" }}
    >
      {/* ── Background ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(234,120,30,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(234,120,30,.055) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(234,120,30,.13) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />
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
      <div
        className="relative mx-auto w-full"
        style={{ zIndex: 10, maxWidth: 560, paddingTop: 8 }}
      >
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

        {/* ── Score card ── */}
        <div
          style={{
            borderRadius: 20,
            background: "rgba(13,13,13,.92)",
            backdropFilter: "blur(24px)",
            border: "0.5px solid rgba(234,120,30,.2)",
            boxShadow:
              "0 0 0 0.5px rgba(234,120,30,.08), 0 40px 80px rgba(0,0,0,.6)",
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg, transparent, ${barColor}, transparent)`,
            }}
          />
          <div style={{ padding: "2.5rem 2rem" }}>
            {/* Trophy */}
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
                {text}
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

            {/* Accuracy bar */}
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

            {/* Stats */}
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
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: s.bg,
                    border: `0.5px solid ${s.border}`,
                    borderRadius: 10,
                    padding: "12px 8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontFamily: "Georgia, serif",
                      color: s.color,
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
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
                    {s.label}
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

            {/* Buttons */}
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
                {[
                  {
                    label: "Home",
                    icon: <Home size={13} />,
                    onClick: () => router.push("/home"),
                  },
                  {
                    label: "Profile",
                    icon: <User size={13} />,
                    onClick: () => router.push("/profile"),
                  },
                  {
                    label: "Leaderboard",
                    icon: <Trophy size={13} />,
                    onClick: () => router.push("/leaderboard"),
                  },
                  {
                    label: "Play Again",
                    icon: <RotateCcw size={14} />,
                    onClick: () => router.push(`/lobby/${lobbyId}`),
                  },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.onClick}
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
                        "background .2s, border-color .2s, color .2s, transform .15s",
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.background = "rgba(234,120,30,.07)";
                      b.style.borderColor = "rgba(234,120,30,.5)";
                      b.style.color = "#f5f0e8";
                      b.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.background = "transparent";
                      b.style.borderColor = "rgba(234,120,30,.25)";
                      b.style.color = "rgba(245,240,232,.6)";
                      b.style.transform = "translateY(0)";
                    }}
                  >
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Question Review ── */}
        {reviewData.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#ea781e",
                  whiteSpace: "nowrap",
                }}
              >
                Question Review
              </span>
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
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "#97C459",
                    background: "rgba(59,109,17,.12)",
                    border: "0.5px solid rgba(59,109,17,.25)",
                    borderRadius: 100,
                    padding: "3px 10px",
                  }}
                >
                  <CheckCircle size={10} /> {score} correct
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "#F09595",
                    background: "rgba(163,45,45,.12)",
                    border: "0.5px solid rgba(163,45,45,.25)",
                    borderRadius: 100,
                    padding: "3px 10px",
                  }}
                >
                  <XCircle size={10} /> {total - score} wrong
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {reviewData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: 14,
                    background: "rgba(13,13,13,.88)",
                    border: `0.5px solid ${item.isCorrect ? "rgba(59,109,17,.25)" : "rgba(163,45,45,.25)"}`,
                    overflow: "hidden",
                  }}
                >
                  {/* Question header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "13px 16px",
                      background: item.isCorrect
                        ? "rgba(59,109,17,.06)"
                        : "rgba(163,45,45,.06)",
                      borderBottom: `0.5px solid ${item.isCorrect ? "rgba(59,109,17,.12)" : "rgba(163,45,45,.12)"}`,
                    }}
                  >
                    {/* Index badge */}
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        background: item.isCorrect
                          ? "rgba(59,109,17,.2)"
                          : "rgba(163,45,45,.2)",
                        border: `0.5px solid ${item.isCorrect ? "rgba(59,109,17,.4)" : "rgba(163,45,45,.35)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: item.isCorrect ? "#97C459" : "#F09595",
                        flexShrink: 0,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {index + 1}
                    </div>
                    {/* Question text */}
                    <p
                      style={{
                        flex: 1,
                        color: "#f5f0e8",
                        fontSize: 14,
                        fontFamily: "Georgia, serif",
                        lineHeight: 1.5,
                        margin: 0,
                        paddingTop: 2,
                      }}
                    >
                      {item.question}
                    </p>
                    {/* Result icon */}
                    <div style={{ flexShrink: 0, paddingTop: 3 }}>
                      {item.isCorrect ? (
                        <CheckCircle size={16} color="#97C459" />
                      ) : (
                        <XCircle size={16} color="#F09595" />
                      )}
                    </div>
                  </div>

                  {/* Answers body */}
                  <div
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {/* Your answer */}
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: ".09em",
                          textTransform: "uppercase",
                          color: "rgba(245,240,232,.28)",
                          whiteSpace: "nowrap",
                          minWidth: 82,
                        }}
                      >
                        Your answer
                      </span>
                      <div
                        style={{
                          flex: 1,
                          padding: "7px 12px",
                          borderRadius: 8,
                          background: item.isCorrect
                            ? "rgba(59,109,17,.1)"
                            : "rgba(163,45,45,.1)",
                          border: `0.5px solid ${item.isCorrect ? "rgba(59,109,17,.28)" : "rgba(163,45,45,.28)"}`,
                          color: item.isCorrect ? "#97C459" : "#F09595",
                          fontSize: 13,
                          fontFamily: "Georgia, serif",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <span>
                          {item.userAnswerText || (
                            <span style={{ opacity: 0.4, fontStyle: "italic" }}>
                              No answer
                            </span>
                          )}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            opacity: 0.7,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.isCorrect ? "✓ Correct" : "✗ Wrong"}
                        </span>
                      </div>
                    </div>

                    {/* Correct answer — only when wrong */}
                    {!item.isCorrect && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: ".09em",
                            textTransform: "uppercase",
                            color: "rgba(245,240,232,.28)",
                            whiteSpace: "nowrap",
                            minWidth: 82,
                          }}
                        >
                          Correct
                        </span>
                        <div
                          style={{
                            flex: 1,
                            padding: "7px 12px",
                            borderRadius: 8,
                            background: "rgba(59,109,17,.1)",
                            border: "0.5px solid rgba(59,109,17,.28)",
                            color: "#97C459",
                            fontSize: 13,
                            fontFamily: "Georgia, serif",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <span>{item.correctAnswerText}</span>
                          <span style={{ fontSize: 11, opacity: 0.7 }}>✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontSize: 18,
            color: "rgba(245,240,232,.80)",
            fontFamily: "Georgia, serif",
          }}
        >
          RoomCode · {lobbyId}
        </p>
      </div>

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
