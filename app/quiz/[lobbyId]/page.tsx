"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Clock, ChevronRight, ChevronLeft, Trophy, Home } from "lucide-react";
import { socket } from "@/lib/socket/socket";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [userId, setUserId] = useState("");
  const roomId = Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : String(params.lobbyId);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  type Question = {
    optionA: any;
    optionB: any;
    optionC: any;
    optionD: any;
    question: string;
    options: string[];
    answer: string;
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch(`/api/questions?lobbyId=${roomId}`);

        const data = await res.json();

        console.log("QUESTIONS FROM API:", data);

        setQuestions(data.questions || []);
      } catch (err) {
        console.error("LOAD QUESTIONS ERROR:", err);
      }
    }

    if (roomId) {
      loadQuestions();
    }
  }, [roomId]);

  useEffect(() => {
    socket.on("quizStarted", (data) => {
      console.log("QUIZ STARTED RECEIVED", data);
      setQuestions(data.questions);
    });

    return () => {
      socket.off("quizStarted");
    };
  }, []);

  // const questions = [
  //   {
  //     question: "What is the capital of India?",
  //     options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
  //     answer: "Delhi",
  //   },
  //   { question: "2 + 2 = ?", options: ["2", "4", "8", "10"], answer: "4" },
  //   {
  //     question: "Largest planet?",
  //     options: ["Earth", "Mars", "Jupiter", "Venus"],
  //     answer: "Jupiter",
  //   },
  //   {
  //     question: "HTML stands for?",
  //     options: [
  //       "Hyper Text Markup Language",
  //       "Home Tool Markup Language",
  //       "Hyper Tool",
  //       "Markup Text",
  //     ],
  //     answer: "Hyper Text Markup Language",
  //   },
  //   {
  //     question: "React created by?",
  //     options: ["Google", "Meta", "Microsoft", "Netflix"],
  //     answer: "Meta",
  //   },
  //   { question: "5 × 6 = ?", options: ["30", "40", "20", "10"], answer: "30" },
  //   {
  //     question: "Fastest animal?",
  //     options: ["Lion", "Tiger", "Cheetah", "Elephant"],
  //     answer: "Cheetah",
  //   },
  //   {
  //     question: "CSS used for?",
  //     options: ["Database", "Styling", "Backend", "Authentication"],
  //     answer: "Styling",
  //   },
  // ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  // const [answers, setAnswers] = useState<string[]>(
  //   Array(questions.length).fill(""),
  // );

  const [answers, setAnswers] = useState<string[]>([]);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", roomId);

    return () => {
      socket.off("quizStarted");
      socket.off("playersUpdated");
    };
  }, [roomId, userId]);

  useEffect(() => {
    if (!userId) return;

    async function loadProgress() {
      try {
        const res = await fetch(
          `/api/quiz-progress?lobbyId=${roomId}&userId=${userId}`,
        );

        const data = await res.json();

        if (data?.id) {
          setCurrentQuestion(data.currentQuestion ?? 0);
          setAnswers(data.answers ?? Array(questions.length).fill(""));
          setScore(data.score ?? 0);
          setQuizEnded(data.quizEnded ?? false);
        }
      } catch {
        // Optional: show toast here later
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [userId, roomId, questions.length]);

  // useEffect(() => {
  //   if (loading || !userId) return;

  //   fetch("/api/quiz-progress", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       lobbyId: roomId,
  //       userId,
  //       currentQuestion,
  //       answers,
  //       score,
  //       quizEnded,
  //     }),
  //   });
  // }, [
  //   currentQuestion,
  //   answers,
  //   score,
  //   quizEnded,
  //   loading,
  //   userId,
  //   roomId,
  // ]);

  useEffect(() => {
    if (loading || quizEnded) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, quizEnded, loading]);

  function finishQuiz() {
    let finalScore = 0;

    answers.forEach((answer, index) => {
      if (answer === questions[index].answer) {
        finalScore++;
      }
    });

    setScore(finalScore);

    socket.emit("update-score", {
      lobbyId: roomId,
      playerId: userId,
      score: finalScore,
    });

    setQuizEnded(true);
  }

  function moveNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((p) => p + 1);
      setTimeLeft(30);
    } else finishQuiz();
  }

  function movePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((p) => p - 1);
      setTimeLeft(30);
    }
  }

  function submitAnswer(option: string) {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  }

  // ── Background layers (shared) ─────────────────────────────────────────────
  const Background = () => (
    <>
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
      <style>{`
        @keyframes qrScan   { 0%{top:-2%} 100%{top:102%} }
        @keyframes qrBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatA   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatB   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes floatC   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spinRing { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes timerShrink { 0%{width:100%} 100%{width:0%} }
      `}</style>
    </>
  );

  // ── Loading ────────────────────────────────────────────────────────────────
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

  // ── Results screen ─────────────────────────────────────────────────────────
  if (quizEnded) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <main
        className="relative min-h-screen overflow-x-hidden p-8"
        style={{ background: "#0a0a0a" }}
      >
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
                </span>{" "}
                🎉
              </h1>
            </div>
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
              <Home size={14} /> Back to Home
            </button>
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
              {pct >= 80
                ? "🔥 Excellent!"
                : pct >= 50
                  ? "👍 Good effort!"
                  : "💪 Keep practising!"}
            </p>

            {/* Score bar */}
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
                  width: `${pct}%`,
                  background:
                    pct >= 80 ? "#3B6D11" : pct >= 50 ? "#ea781e" : "#A32D2D",
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
              {pct}% correct
            </p>
          </div>

          {/* Answer review */}
          <div
            style={{
              fontSize: 10,
              letterSpacing: ".13em",
              textTransform: "uppercase",
              color: "#ea781e",
              marginBottom: 14,
            }}
          >
            Answer Review
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {questions.map((q, index) => (
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
                  {[q.optionA, q.optionB, q.optionC, q.optionD].map(
                    (option: string) => {
                      const isCorrect = option === q.answer;
                      const isWrong = option === answers[index] && !isCorrect;
                      return (
                        <div
                          key={option}
                          style={{
                            padding: "9px 14px",
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "Georgia, serif",
                            background: isCorrect
                              ? "rgba(59,109,17,.18)"
                              : isWrong
                                ? "rgba(163,45,45,.15)"
                                : "rgba(245,240,232,.03)",
                            border: `0.5px solid ${isCorrect ? "#3B6D11" : isWrong ? "#A32D2D" : "rgba(245,240,232,.08)"}`,
                            color: isCorrect
                              ? "#97C459"
                              : isWrong
                                ? "#F09595"
                                : "rgba(245,240,232,.45)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {option}
                          {isCorrect && (
                            <span style={{ fontSize: 11 }}>✓ Correct</span>
                          )}
                          {isWrong && (
                            <span style={{ fontSize: 11 }}>✗ Wrong</span>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ── Active quiz screen ─────────────────────────────────────────────────────
 
if (!questions.length) {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(234,120,30,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(234,120,30,.055) 1px, transparent 1px)`, backgroundSize: "48px 48px", zIndex: 0 }} />
      {/* Top glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(234,120,30,.14) 0%, transparent 68%)", zIndex: 0 }} />
      {/* Bottom-right glow */}
      <div className="fixed bottom-0 right-0 pointer-events-none" style={{ width: 400, height: 400, borderRadius: "50%", background: "rgba(234,120,30,.07)", filter: "blur(100px)", zIndex: 0 }} />
      {/* Scanline */}
      <div className="fixed left-0 right-0 pointer-events-none" style={{ height: 2, background: "linear-gradient(90deg, transparent, rgba(234,120,30,.25), transparent)", animation: "qrScan 6s linear infinite", zIndex: 1 }} />
      {/* Orbs */}
      <div className="fixed pointer-events-none" style={{ top: "18%", left: "5%", width: 76, height: 76, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)", boxShadow: "0 0 0 1px rgba(234,120,30,.3),0 0 34px rgba(234,120,30,.18)", animation: "floatA 8s ease-in-out infinite", opacity: 0.42, zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ top: "58%", right: "5%", width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)", animation: "floatB 10s ease-in-out infinite", opacity: 0.38, zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: "18%", left: "9%", width: 26, height: 26, borderRadius: "50%", background: "#1a0a03", border: "1px solid rgba(234,120,30,.4)", animation: "floatC 6s ease-in-out infinite", opacity: 0.5, zIndex: 0 }} />
      {/* Rings */}
      <div className="fixed pointer-events-none" style={{ top: "6%", left: "2%", width: 100, height: 100, borderRadius: "50%", border: "0.5px solid rgba(234,120,30,.14)", animation: "spinRing 22s linear infinite", zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: "8%", right: "3%", width: 64, height: 64, borderRadius: "50%", border: "0.5px solid rgba(234,120,30,.11)", animation: "spinRing 16s linear infinite reverse", zIndex: 0 }} />

      {/* Card */}
      <div className="relative flex flex-col items-center text-center" style={{ zIndex: 10, maxWidth: 420, width: "100%", margin: "0 1rem", padding: "3rem 2.5rem", borderRadius: 20, background: "rgba(13,13,13,.9)", backdropFilter: "blur(20px)", border: "0.5px solid rgba(234,120,30,.2)", boxShadow: "0 0 0 0.5px rgba(234,120,30,.08), 0 32px 80px rgba(0,0,0,.55)" }}>
        {/* Icon */}
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 0 0 1px rgba(234,120,30,.4), 0 12px 32px rgba(234,120,30,.25)", animation: "floatA 5s ease-in-out infinite", marginBottom: "1.5rem" }}>
          ⏳
        </div>

        <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "#ea781e", marginBottom: 10 }}>
          QuizRush — Standby
        </div>

        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, color: "#f5f0e8", lineHeight: 1.3, marginBottom: 8 }}>
          Waiting for host to{" "}
          <span style={{ color: "#ea781e", fontStyle: "italic" }}>start the quiz…</span>
        </h1>

        <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "rgba(245,240,232,.45)", lineHeight: 1.7, marginBottom: "2rem" }}>
          The host is setting things up.<br />
          Get ready — questions drop any second.
        </p>

        {/* Bouncing dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: "2rem" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#ea781e", animation: `dotBounce 1.2s ease-in-out infinite ${i * 0.2}s` }} />
          ))}
        </div>

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(234,120,30,.1)", border: "0.5px solid rgba(234,120,30,.35)", borderRadius: 100, padding: "5px 14px", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#ea781e" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ea781e", display: "inline-block", animation: "qrBlink 1s step-end infinite" }} />
          Connected to room
        </div>

        <div style={{ width: "100%", height: "0.5px", background: "rgba(234,120,30,.15)", margin: "1.5rem 0" }} />

        <p style={{ fontSize: 11, color: "rgba(245,240,232,.2)", fontFamily: "Georgia, serif" }}>
          You'll be taken to the quiz automatically
        </p>
      </div>

      <style>{`
        @keyframes qrScan   { 0%{top:-2%} 100%{top:102%} }
        @keyframes qrBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatA   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatB   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes floatC   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spinRing { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes dotBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
      `}</style>
    </main>
  );
}



  
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
        {/* ── Top bar ── */}
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
              </span>{" "}
              🚀
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

        {/* ── Main card ── */}
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
              {questions[currentQuestion].question}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              questions[currentQuestion].optionA,
              questions[currentQuestion].optionB,
              questions[currentQuestion].optionC,
              questions[currentQuestion].optionD,
            ].map((option: string, i: number) => {
              const selected = answers[currentQuestion] === option;
              return (
                <button
                  key={option}
                  onClick={() => submitAnswer(option)}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    borderRadius: 10,
                    textAlign: "left",
                    background: selected ? "rgba(234,120,30,.15)" : "#111",
                    border: selected
                      ? "0.5px solid rgba(234,120,30,.6)"
                      : "0.5px solid rgba(245,240,232,.08)",
                    color: selected ? "#f5f0e8" : "rgba(245,240,232,.65)",
                    fontSize: 14,
                    fontFamily: "Georgia, serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition:
                      "background .15s, border-color .15s, color .15s",
                    boxShadow: selected
                      ? "0 0 0 3px rgba(234,120,30,.08)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selected) return;
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(234,120,30,.35)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(234,120,30,.06)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#f5f0e8";
                  }}
                  onMouseLeave={(e) => {
                    if (selected) return;
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(245,240,232,.08)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#111";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(245,240,232,.65)";
                  }}
                >
                  {/* Letter badge */}
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: selected
                        ? "#ea781e"
                        : "rgba(245,240,232,.06)",
                      border: selected
                        ? "none"
                        : "0.5px solid rgba(245,240,232,.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: selected ? "#fff" : "rgba(245,240,232,.4)",
                      flexShrink: 0,
                      transition: "background .15s",
                    }}
                  >
                    {["A", "B", "C", "D"][i]}
                  </span>
                  {option}
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
                setTimeLeft(30);
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
