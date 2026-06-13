"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Clock, ChevronRight, ChevronLeft, Trophy } from "lucide-react";
import { socket } from "@/lib/socket/socket";

export default function QuizPage() {
  const params = useParams();
  const lobbyId = params.lobbyId as string;
  const router = useRouter();
  const { data: session } = useSession();

  const [userId, setUserId] = useState("");

  const roomId = Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : String(params.lobbyId);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  type AnswerKey = "optionA" | "optionB" | "optionC" | "optionD";

  type Question = {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    answer: AnswerKey;
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  type ReviewItem = {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  };
  // Listen for quiz start and question updates
  useEffect(() => {
    socket.on("quiz-started", (questions) => {
      console.log("QUIZ STARTED RECEIVED", questions);

      setQuestions(questions);
      setLoading(false);
      setQuizEnded(false);
      setCurrentQuestion(0);
    });

    return () => {
      socket.off("quiz-started");
      setLoading(false);
    };
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerKey[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const q = questions[currentQuestion] ?? null;

  // User ID setup (email for authenticated users, guest ID for others)
  useEffect(() => {
    if (session?.user?.email) {
      setUserId(session.user.email);
      return;
    }
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }
    setUserId(guestId);
  }, [session]);

  // Socket connection and event handlers
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-lobby", {
      lobbyId: roomId,
      player: {
        id: userId,
        name: session?.user?.name ?? "Player",
      },
    });

    socket.emit("request-quiz-state", {
      lobbyId: roomId,
    });

    // Receive current quiz state after refresh
    socket.on("quiz-state", (data) => {
      console.log("QUIZ STATE RECEIVED:", data);

      if (data.questions?.length) {
        setQuestions(data.questions);
        setLoading(false);

        if (data.currentQuestion !== undefined) {
          setCurrentQuestion(data.currentQuestion);
        }
      }
    });

    socket.emit("request-quiz-state", {
      lobbyId: roomId,
    });

    return () => {
      socket.off("quiz-state");
      socket.off("quiz-started");
      socket.off("players-update");
    };
  }, [roomId, userId]);

  // Load quiz progress on initial load
  useEffect(() => {
    if (!userId) return;

    async function loadProgress() {
      try {
        const res = await fetch(
          `/api/quiz-progress?lobbyId=${roomId}&userId=${userId}`,
        );

        const data = await res.json();

        console.log("LOADED PROGRESS:", data);

        if (data?.lobbyId) {
          setCurrentQuestion(data.currentQuestion ?? 0);
          setScore(data.score ?? 0);

          if (data.quizEnded) {
            setQuizEnded(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [userId, roomId]);

  // Initialize answers array when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && answers.length === 0) {
      setAnswers(Array(questions.length).fill(""));
    }
  }, [questions]);

  // Timer effect
  useEffect(() => {
    if (loading || quizEnded || questions.length === 0) return;

    setTimeLeft(30);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          moveNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, quizEnded, loading, questions.length]);

  // Quiz end effect
  useEffect(() => {
    console.log("QUIZ ENDED =", quizEnded);
  }, [quizEnded]);

  // Request quiz state on initial load and when roomId changes
  useEffect(() => {
    if (!socket.connected) return;

    socket.emit("request-quiz-state", {
      lobbyId: roomId,
    });
  }, [roomId]);

  //rejoin
  useEffect(() => {
    if (!userId) return;

    socket.emit("rejoin-lobby", {
      lobbyId,
      userId,
    });
  }, [lobbyId, userId]);

  function finishQuiz() {
    let finalScore = 0;

    const reviewData = questions.map((question, index) => {
      const userAnswerKey = answers?.[index]; // "optionA"

      const isCorrect = userAnswerKey === question.answer;

      if (isCorrect) finalScore++;

      const optionMap: Record<string, string> = {
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
      };

      return {
        question: question.question,
        userAnswer: optionMap[userAnswerKey ?? ""] ?? "Not answered",
        correctAnswer: optionMap[question.answer],
        isCorrect,
      };
    });

    //  SAVE FIRST (critical for race condition fix)
    localStorage.setItem(`review-${lobbyId}`, JSON.stringify(reviewData));

    localStorage.setItem(
      `score-${lobbyId}`,
      JSON.stringify({
        score: finalScore,
        total: questions.length,
      }),
    );

    //  DO NOT rely on React state for results page
    setQuizEnded(true);
    setScore(finalScore);

    //  slight delay prevents UI flicker in Next.js router
    setTimeout(() => {
      router.replace(`/quiz/${lobbyId}/results`);
    }, 50);
  }

  function moveNext() {
    console.log("MOVE NEXT", currentQuestion, questions.length);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((p) => p + 1);
      setTimeLeft(30); // reset timer for next question
    } else {
      finishQuiz();
    }
  }

  function movePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((p) => p - 1);
      setTimeLeft(30);
    }
  }

  function submitAnswer(answer: AnswerKey) {
    console.log("SUBMIT ANSWER", {
      lobbyId,
      playerId: userId,
      answer,
    });
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    socket.emit("submit-answer", {
      lobbyId,
      playerId: userId,
      answer,
    });
  }

  // ── Background layers (shared) ──
  const Background = () => (
    <>
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(234,120,30,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(234,120,30,.055) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />
      {/* Top radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(234,120,30,.13) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />
      {/* Bottom-right glow */}
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
      {/* Scanline — top:0 is required for qrScan animation to work */}
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
      {/* Orb 1 */}
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
      {/* Orb 2 */}
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
      {/* Orb 3 */}
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
      {/* Ring 1 */}
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
      {/* Ring 2 */}
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
      <style>{`
        @keyframes qrScan    { 0%{top:-2%} 100%{top:102%} }
        @keyframes qrBlink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatA    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatB    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes floatC    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spinRing  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes dotBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
      `}</style>
    </>
  );

  // ── Loading ──
  console.log("RENDER STATE", {
    loading,
    quizEnded,
    questionsLength: questions.length,
    currentQuestion,
    q,
  });

  if (loading) {
    return (
      <main
        className="relative min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        <Background />
        <div className="relative" style={{ zIndex: 10, textAlign: "center" }}>
          <div
            style={{
              fontSize: 36,
              animation: "floatA 2s ease-in-out infinite",
            }}
          >
            ⚡
          </div>
          <p
            style={{
              color: "#ea781e",
              fontFamily: "Georgia, serif",
              fontSize: 16,
              marginTop: 12,
              letterSpacing: ".08em",
            }}
          >
            Loading quiz…
          </p>
        </div>
      </main>
    );
  }

  // ── Results screen ──

  if (quizEnded) {
    const pct = Math.round((score / questions.length) * 100);
    const safePct = Math.min(100, Math.max(0, pct || 0));

    return (
      <main
        className="relative min-h-screen overflow-x-hidden p-8"
        style={{ background: "#0a0a0a" }}
      >
        {/* FIX 1: <Background /> was missing here — no 3D effects on results screen */}
        <Background />

        <div className="relative max-w-3xl mx-auto" style={{ zIndex: 10 }}>
          {/* Header */}
          <div
            className="flex items-center justify-between flex-wrap gap-3 pb-6 mb-6"
            style={{ borderBottom: "0.5px solid rgba(234,120,30,.15)" }}
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
                QuizRush — Results
              </div>
              <h1
                style={{
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                  fontWeight: 400,
                  fontFamily: "Georgia, serif",
                  color: "#f5f0e8",
                }}
              >
                Quiz{" "}
                <span style={{ color: "#ea781e", fontStyle: "italic" }}>
                  Finished
                </span>
              </h1>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/home")}
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
                Back to Home
              </button>
              <button
                onClick={() => router.push(`/lobby/${roomId}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "9px 20px",
                  borderRadius: 8,
                  background: "#0d0d0d",
                  border: "1px solid rgba(234,120,30,.3)",
                  color: "#ea781e",
                  fontSize: 13,
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                  transition: "background .2s, transform .15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(234,120,30,.12)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#0d0d0d";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                View Leaderboard
              </button>
            </div>
          </div>

          {/* Score card */}
          <div
            style={{
              borderRadius: 20,
              background: "rgba(13,13,13,.88)",
              backdropFilter: "blur(20px)",
              border: "0.5px solid rgba(234,120,30,.2)",
              padding: "2.5rem 2rem",
              textAlign: "center",
              marginBottom: 24,
              boxShadow: "0 32px 80px rgba(0,0,0,.5)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                boxShadow:
                  "0 0 0 1px rgba(234,120,30,.4), 0 12px 32px rgba(234,120,30,.25)",
                animation: "floatA 5s ease-in-out infinite",
              }}
            >
              <Trophy size={32} color="#fff" />
            </div>
            <p
              style={{
                color: "#ea781e",
                fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                fontFamily: "Georgia, serif",
                fontWeight: 400,
                marginTop: 16,
                lineHeight: 1,
              }}
            >
              {score}
              <span style={{ fontSize: "40%", color: "rgba(245,240,232,.4)" }}>
                /{questions.length}
              </span>
            </p>
            <p
              style={{
                color: "rgba(245,240,232,.5)",
                fontSize: 14,
                fontFamily: "Georgia, serif",
                marginTop: 8,
              }}
            >
              {safePct >= 80
                ? " Excellent!"
                : safePct >= 50
                  ? " Good effort!"
                  : " Keep practising!"}
            </p>
            <div
              style={{
                height: 4,
                background: "rgba(245,240,232,.08)",
                borderRadius: 2,
                marginTop: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${safePct}%`,
                  background:
                    safePct >= 80
                      ? "#3B6D11"
                      : safePct >= 50
                        ? "#ea781e"
                        : "#A32D2D",
                  borderRadius: 2,
                  transition: "width 1s ease",
                }}
              />
            </div>
            <p
              style={{
                color: "rgba(245,240,232,.3)",
                fontSize: 11,
                marginTop: 6,
              }}
            >
              {safePct}% correct
            </p>
          </div>

          {/* Answer review */}
          {/* <div
            style={{
              fontSize: 10,
              letterSpacing: ".13em",
              textTransform: "uppercase",
              color: "#ea781e",
              marginBottom: 14,
            }}
          >
            Answer Review
          </div> */}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {questions.map((q, index) => {
              return (
                <div
                  key={index}
                  style={{
                    borderRadius: 14,
                    background: "rgba(13,13,13,.88)",
                    border: "0.5px solid rgba(234,120,30,.15)",
                    padding: "1.25rem 1.5rem",
                  }}
                >
                  <p
                    style={{
                      color: "#f5f0e8",
                      fontSize: 14,
                      fontFamily: "Georgia, serif",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{ color: "rgba(245,240,232,.35)", marginRight: 8 }}
                    >
                      {index + 1}.
                    </span>
                    {q.question}
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {/* FIX 2: was using questions[currentQuestion].optionX — wrong! */}
                    {/* Now correctly uses q.optionX (the per-card mapped question) */}
                    {[
                      { key: "optionA", value: q.optionA },
                      { key: "optionB", value: q.optionB },
                      { key: "optionC", value: q.optionC },
                      { key: "optionD", value: q.optionD },
                    ].map((option, i) => {
                      const isCorrect = option.key === q.answer;
                      const selectedKey = answers[index];
                      const isWrong =
                        selectedKey === option.key && selectedKey !== q.answer;
                      return (
                        <div
                          key={i}
                          style={{
                            padding: "9px 14px",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                            background: isCorrect
                              ? "rgba(59,109,17,.18)"
                              : isWrong
                                ? "rgba(163,45,45,.15)"
                                : "rgba(245,240,232,.03)",
                            border: `0.5px solid ${isCorrect ? "#3B6D11" : isWrong ? "#A32D2D" : "rgba(255,255,255,.1)"}`,
                            color: isCorrect
                              ? "#97C459"
                              : isWrong
                                ? "#F09595"
                                : "rgba(245,240,232,.45)",
                            fontSize: 13,
                            fontFamily: "Georgia, serif",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 5,
                                background: isCorrect
                                  ? "rgba(59,109,17,.3)"
                                  : isWrong
                                    ? "rgba(163,45,45,.3)"
                                    : "rgba(245,240,232,.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                flexShrink: 0,
                              }}
                            >
                              {["A", "B", "C", "D"][i]}
                            </span>
                            {option.value}
                          </span>
                          {isCorrect && (
                            <span
                              style={{ fontSize: 11, whiteSpace: "nowrap" }}
                            >
                              ✓ Correct
                            </span>
                          )}
                          {isWrong && (
                            <span
                              style={{ fontSize: 11, whiteSpace: "nowrap" }}
                            >
                              ✗ Wrong
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // ── Waiting for host ──
  if (!questions.length) {
    console.log("RENDERING QUIZ UI");
    return (
      <main
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "#0a0a0a" }}
      >
        {/* FIX 3: replaced broken inline divs (missing top:0 on scanline) with <Background /> */}
        <Background />

        <div
          className="relative flex flex-col items-center text-center"
          style={{
            zIndex: 10,
            maxWidth: 420,
            width: "100%",
            margin: "0 1rem",
            padding: "3rem 2.5rem",
            borderRadius: 20,
            background: "rgba(13,13,13,.9)",
            backdropFilter: "blur(20px)",
            border: "0.5px solid rgba(234,120,30,.2)",
            boxShadow:
              "0 0 0 0.5px rgba(234,120,30,.08), 0 32px 80px rgba(0,0,0,.55)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              boxShadow:
                "0 0 0 1px rgba(234,120,30,.4), 0 12px 32px rgba(234,120,30,.25)",
              animation: "floatA 5s ease-in-out infinite",
              marginBottom: "1.5rem",
            }}
          >
            ⏳
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "#ea781e",
              marginBottom: 10,
            }}
          >
            QuizRush — Standby
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 400,
              color: "#f5f0e8",
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            Waiting for host to{" "}
            <span style={{ color: "#ea781e", fontStyle: "italic" }}>
              start the quiz…
            </span>
          </h1>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 14,
              color: "rgba(245,240,232,.45)",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            The host is setting things up.
            <br />
            Get ready — questions drop any second.
          </p>
          {/* Bouncing dots */}
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ea781e",
                  animation: `dotBounce 1.2s ease-in-out infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(234,120,30,.1)",
              border: "0.5px solid rgba(234,120,30,.35)",
              borderRadius: 100,
              padding: "5px 14px",
              fontSize: 11,
              letterSpacing: ".12em",
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
            Connected to room
          </div>
          <div
            style={{
              width: "100%",
              height: "0.5px",
              background: "rgba(234,120,30,.15)",
              margin: "1.5rem 0",
            }}
          />
          <p
            style={{
              fontSize: 11,
              color: "rgba(245,240,232,.2)",
              fontFamily: "Georgia, serif",
            }}
          >
            You'll be taken to the quiz automatically
          </p>
        </div>
      </main>
    );
  }

  // ── Active quiz screen ──
  const progress = (currentQuestion / questions.length) * 100;
  const timerPct = (timeLeft / 30) * 100;
  const timerDanger = timeLeft <= 8;

  return (
    <main
      className="relative min-h-screen overflow-x-hidden p-8"
      style={{ background: "#0a0a0a" }}
    >
      <Background />

      <div className="relative max-w-2xl mx-auto" style={{ zIndex: 10 }}>
        {/* Top bar */}
        <div
          className="flex items-center justify-between flex-wrap gap-3 pb-5 mb-6"
          style={{ borderBottom: "0.5px solid rgba(234,120,30,.15)" }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "#ea781e",
                marginBottom: 3,
              }}
            >
              QuizRush
            </div>
            <h1
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                fontWeight: 400,
                fontFamily: "Georgia, serif",
                color: "#f5f0e8",
              }}
            >
              Quiz{" "}
              <span style={{ color: "#ea781e", fontStyle: "italic" }}>
                Started
              </span>
            </h1>
          </div>
          {/* Timer badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: timerDanger
                ? "rgba(163,45,45,.15)"
                : "rgba(234,120,30,.1)",
              border: `0.5px solid ${timerDanger ? "#A32D2D" : "rgba(234,120,30,.35)"}`,
              borderRadius: 100,
              padding: "7px 16px",
              color: timerDanger ? "#F09595" : "#ea781e",
              fontSize: 14,
              fontFamily: "Georgia, serif",
              transition: "all .3s",
            }}
          >
            <Clock size={14} />
            <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 28 }}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Main card */}
        <div
          style={{
            borderRadius: 20,
            background: "rgba(13,13,13,.9)",
            backdropFilter: "blur(20px)",
            border: "0.5px solid rgba(234,120,30,.2)",
            padding: "2rem",
            boxShadow: "0 32px 80px rgba(0,0,0,.5)",
          }}
        >
          {/* Progress row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(245,240,232,.4)",
                whiteSpace: "nowrap",
              }}
            >
              Q {currentQuestion + 1} / {questions.length}
            </span>
            <div
              style={{
                flex: 1,
                height: 3,
                background: "rgba(245,240,232,.07)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "#ea781e",
                  borderRadius: 2,
                  transition: "width .4s ease",
                }}
              />
            </div>
            <span
              style={{ fontSize: 11, color: "#ea781e", whiteSpace: "nowrap" }}
            >
              {answers.filter(Boolean).length} answered
            </span>
          </div>

          {/* Timer bar */}
          <div
            style={{
              height: 3,
              background: "rgba(245,240,232,.05)",
              borderRadius: 2,
              marginBottom: 24,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${timerPct}%`,
                background: timerDanger ? "#A32D2D" : "#ea781e",
                borderRadius: 2,
                transition: "width 1s linear, background .3s",
              }}
            />
          </div>

          {/* Question */}
          <div
            style={{
              background: "#111",
              border: "0.5px solid rgba(234,120,30,.15)",
              borderRadius: 12,
              padding: "1.25rem 1.5rem",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#ea781e",
                marginBottom: 8,
              }}
            >
              Question {currentQuestion + 1}
            </div>
            <p
              style={{
                color: "#f5f0e8",
                fontSize: "clamp(15px, 2.5vw, 18px)",
                fontFamily: "Georgia, serif",
                lineHeight: 1.5,
              }}
            >
              {questions?.length > 0 &&
                questions[currentQuestion] &&
                questions[currentQuestion].question}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { key: "optionA", value: q.optionA },
              { key: "optionB", value: q.optionB },
              { key: "optionC", value: q.optionC },
              { key: "optionD", value: q.optionD },
            ].map((option, i) => {
              const selectedKey = answers[currentQuestion];
              const isSelected = selectedKey === option.key;
              const isCorrect = option.key === q.answer;
              const isWrong = isSelected && option.key !== q.answer;

              return (
                <button
                  key={option.key}
                  onClick={() => submitAnswer(option.key as AnswerKey)}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    borderRadius: 10,
                    textAlign: "left",
                    background: isSelected
                      ? "rgba(234,120,30,.15)"
                      : isCorrect && quizEnded
                        ? "rgba(59,109,17,.18)"
                        : isWrong && quizEnded
                          ? "rgba(163,45,45,.15)"
                          : "#111",
                    border: isSelected
                      ? "0.5px solid rgba(234,120,30,.6)"
                      : isCorrect && quizEnded
                        ? "0.5px solid #3B6D11"
                        : isWrong && quizEnded
                          ? "0.5px solid #A32D2D"
                          : "0.5px solid rgba(245,240,232,.08)",
                    color: isSelected
                      ? "#f5f0e8"
                      : isCorrect && quizEnded
                        ? "#97C459"
                        : isWrong && quizEnded
                          ? "#F09595"
                          : "rgba(245,240,232,.65)",
                    fontSize: 14,
                    fontFamily: "Georgia, serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    if (isSelected) return;
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(234,120,30,.35)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(234,120,30,.06)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#f5f0e8";
                  }}
                  onMouseLeave={(e) => {
                    if (isSelected) return;
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(245,240,232,.08)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#111";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(245,240,232,.65)";
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: isSelected
                        ? "#ea781e"
                        : isCorrect && quizEnded
                          ? "#3B6D11"
                          : "rgba(245,240,232,.06)",
                      border:
                        isSelected || (isCorrect && quizEnded)
                          ? "none"
                          : "0.5px solid rgba(245,240,232,.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {["A", "B", "C", "D"][i]}
                  </span>
                  {option.value}
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={movePrevious}
              disabled={currentQuestion === 0}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 10,
                background: "transparent",
                border: "0.5px solid rgba(234,120,30,.2)",
                color:
                  currentQuestion === 0
                    ? "rgba(245,240,232,.2)"
                    : "rgba(245,240,232,.6)",
                fontSize: 14,
                fontFamily: "Georgia, serif",
                cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "border-color .2s, color .2s",
              }}
              onMouseEnter={(e) => {
                if (currentQuestion === 0) return;
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(234,120,30,.5)";
                (e.currentTarget as HTMLButtonElement).style.color = "#f5f0e8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(234,120,30,.2)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  currentQuestion === 0
                    ? "rgba(245,240,232,.2)"
                    : "rgba(245,240,232,.6)";
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={finishQuiz}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  background: "rgba(59,109,17,.2)",
                  border: "0.5px solid #3B6D11",
                  color: "#97C459",
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "background .2s, transform .15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(59,109,17,.35)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(59,109,17,.2)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                ✓ Submit Quiz
              </button>
            ) : (
              <button
                onClick={moveNext}
                style={{
                  flex: 1,
                  padding: "12px 0",
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
                  gap: 6,
                  boxShadow: "0 6px 18px rgba(234,120,30,.22)",
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
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Dot progress tracker */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          {questions.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrentQuestion(i);
                setTimeLeft(50);
              }}
              style={{
                width: i === currentQuestion ? 22 : 8,
                height: 8,
                borderRadius: 4,
                background: answers[i]
                  ? "#ea781e"
                  : i === currentQuestion
                    ? "rgba(234,120,30,.5)"
                    : "rgba(245,240,232,.1)",
                cursor: "pointer",
                transition: "all .2s",
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
