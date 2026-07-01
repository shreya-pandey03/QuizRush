"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { socket } from "@/lib/socket/socket";
import { useQuizStore } from "@/store/quizStore";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { useLobbyStore } from "@/store/lobbyStore";

export default function QuizPage() {
  const params = useParams();
  const lobbyId = params.lobbyId as string;
  const router = useRouter();
  const { data: session } = useSession();
  const [userId, setUserId] = useState("");
  const timer = useQuizStore((s) => s.timer);
  const roomId = Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : String(params.lobbyId);

  type AnswerKey = "optionA" | "optionB" | "optionC" | "optionD";

  const questions = useQuizStore((s) => s.questions);
  const answers = useQuizStore((s) => s.answers);
  const setAnswer = useQuizStore((s) => s.setAnswer);
  const setQuestions = useQuizStore((s) => s.setQuestions);
  const setLeaderboard = useLeaderboardStore((s) => s.setLeaderboard);

  //quiz-started
  useEffect(() => {
    console.log("REGISTERING quiz-started listener");

    const handleStart = (data: any) => {
      console.log("QUIZ STARTED RECEIVED");
      console.log("ROOM ID:", roomId);
      console.log("FULL DATA:", data);
      console.log("QUESTIONS COUNT:", data?.questions?.length);
      console.log(
        "CURRENT STORE QUESTIONS:",
        useQuizStore.getState().questions.length,
      );
      if (!data?.questions?.length) {
        console.log("NO QUESTIONS RECEIVED");
        return;
      }
      setQuestions(data.questions);
      setCurrentQuestion(data.currentQuestionIndex ?? 0);
      console.log(
        "STORE AFTER UPDATE:",
        useQuizStore.getState().questions.length,
      );
      setLoading(false);
      setQuizEnded(false);
    };

    socket.on("quiz-started", handleStart);

    return () => {
      console.log("REMOVING quiz-started listener");
      socket.off("quiz-started", handleStart);
    };
  }, []);

  //request-resync
  useEffect(() => {
    if (!roomId) return;

    const requestResync = () => {
      console.log("REQUESTING QUIZ RESYNC", roomId);

      socket.emit("request-resync", {
        lobbyId: roomId,
      });
    };

    if (socket.connected) {
      requestResync();
    } else {
      socket.once("connect", requestResync);
    }

    return () => {
      socket.off("connect", requestResync);
    };
  }, [roomId]);

  //quiz-resync
  useEffect(() => {
    const handleResync = (data: any) => {
      console.log("QUIZ RESYNC RECEIVED");
      console.log("DATA:", data);

      if (!data?.questions?.length) {
        console.log("NO QUESTIONS IN RESYNC");
        return;
      }

      setQuestions(data.questions);

      if (data.currentQuestionIndex !== undefined) {
        setCurrentQuestion(data.currentQuestionIndex);
      }

      setLoading(false);
      setQuizEnded(false);
    };

    socket.on("quiz-resync", handleResync);

    return () => {
      socket.off("quiz-resync", handleResync);
    };
  }, []);

  //leaderboard-update
  useEffect(() => {
    const handler = (data: any) => {
      setLeaderboard(data);
    };
    socket.on("leaderboard-update", handler);

    return () => {
      socket.off("leaderboard-update", handler);
    };
  }, [setLeaderboard]);

  const currentQuestion = useQuizStore((s) => s.currentIndex);
  const setCurrentQuestion = useQuizStore((s) => s.setCurrentIndex);
  const [, setScore] = useState(0);
  const setTimer = useQuizStore((s) => s.setTimer);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const q = questions[currentQuestion] ?? null;

  // FIX: track the max timer value so bar drains from 100% → 0%
  const timerMaxRef = useRef(150);
  const spectators = useLobbyStore((s) => s.spectators);

  const isSpectator = spectators.some((s) => s.id === userId);

  useEffect(() => {
    if (timer > timerMaxRef.current * 0.95) {
      timerMaxRef.current = timer;
    }
  }, [timer]);

  useEffect(() => {
    if (session?.user?.email) {
      setUserId(session.user.email);
    } else {
      let guestId = localStorage.getItem("guestId");
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }
      setUserId(guestId);
    }
  }, [session]);

  const joinedRef = useRef(false);
  // useEffect(() => {
  //   if (!userId || joinedRef.current) return;

  //   joinedRef.current = true;

  //   const cleanUserId = session?.user?.email || userId;

  //   socket.emit("join-lobby", {
  //     lobbyId: roomId,
  //     player: {
  //       id: cleanUserId,
  //       name: session?.user?.name ?? "Player",
  //     },
  //   });
  // }, [userId, roomId]);

  useEffect(() => {
    if (!userId) return;
    async function loadProgress() {
      try {
        const res = await fetch(
          `/api/quiz-progress?lobbyId=${roomId}&userId=${userId}`,
        );
        const data = await res.json();
        console.log("LOADED PROGRESS:", data);
        if (data?.currentQuestion !== undefined)
          setCurrentQuestion(data.currentQuestion);
        if (data?.score !== undefined) setScore(data.score);
        if (data?.quizEnded) setQuizEnded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [userId, roomId]);

  useEffect(() => {
    if (!questions?.length) return;
    const currentAnswers = useQuizStore.getState().answers;
    const setAnswer = useQuizStore.getState().setAnswer;
    if (currentAnswers.length === questions.length) return;
    const next = Array(questions.length).fill("");
    for (let i = 0; i < Math.min(currentAnswers.length, next.length); i++) {
      next[i] = currentAnswers[i];
    }
    next.forEach((ans, i) => {
      if (ans) setAnswer(i, ans);
    });
  }, [questions]);

  useEffect(() => {
    const handler = (data: any) => {
      console.log("ANSWER RESULT", data);
    };
    socket.on("answer-result", handler);
    return () => {
      socket.off("answer-result", handler);
    };
  }, []);

  useEffect(() => {
    const handler = (timeLeft: number) => {
      setTimer(timeLeft);
    };
    socket.on("timer-update", handler);
    return () => {
      socket.off("timer-update", handler);
    };
  }, []);

  useEffect(() => {
    const handler = (data: any) => {
      console.log("QUIZ ENDED RECEIVED");
      console.log("userId =", userId);

      const leaderboard = data.leaderboard ?? [];
      setLeaderboard(leaderboard);

      const myResult = leaderboard.find((p: any) => p.id === userId);

      console.log("myResult =", myResult);

      if (!myResult) return;

      const total = questions.length;
      const percent = myResult.score / total;

      // GAME HISTORY

      const oldHistory = JSON.parse(
        localStorage.getItem("game-history") || "[]",
      );

      const newGame = {
        lobbyId,
        score: myResult.score,
        date: new Date().toISOString(),
      };

      const alreadyExists = oldHistory.some((g: any) => g.lobbyId === lobbyId);

      if (!alreadyExists) {
        localStorage.setItem(
          "game-history",
          JSON.stringify([...oldHistory, newGame]),
        );
      }

      // USER STATS

      const oldStats = JSON.parse(
        localStorage.getItem("user-stats") ||
          JSON.stringify({
            gamesPlayed: 0,
            totalScore: 0,
            accuracy: 0,
            winRate: 0,
          }),
      );

      const updatedStats = {
        ...oldStats,
        gamesPlayed: oldStats.gamesPlayed + 1,
        totalScore: oldStats.totalScore + myResult.score,
      };

      localStorage.setItem("user-stats", JSON.stringify(updatedStats));

      // BADGES (FIXED LOGIC)

      let badges: string[] = [];

      if (percent === 1) {
        badges.push("perfect");
      } else if (percent >= 0.8) {
        badges.push("quiz_master");
      } else if (percent >= 0.5) {
        badges.push("good_try");
      } else {
        badges.push("practice_mode");
      }

      console.log("BADGES TO SAVE:", badges);

      const oldBadges = JSON.parse(
        localStorage.getItem("achievements") || "[]",
      );

      const mergedBadges = Array.from(new Set([...oldBadges, ...badges]));

      console.log("SAVING BADGES:", mergedBadges);

      localStorage.setItem("achievements", JSON.stringify(mergedBadges));

      setQuizEnded(true);
    };

    socket.on("quiz-ended", handler);

    return () => {
      socket.off("quiz-ended", handler);
    };
  }, [userId, lobbyId, questions.length]);

  // Restore quiz progress on page refresh
  useEffect(() => {
    const saved = localStorage.getItem(`quiz-${lobbyId}`);
    if (!saved) return;
    const data = JSON.parse(saved);
    // Only restore if quiz still running
    if (!data.answers?.length) return;
    data.answers.forEach((answer: string, index: number) => {
      if (answer) {
        console.log("RESTORING ANSWERS:", data.answers);
        setAnswer(index, answer);
      }
    });
    setCurrentQuestion(data.currentQuestion ?? 0);
  }, [lobbyId]);

  // Save quiz progress automatically
  useEffect(() => {
    localStorage.setItem(
      `quiz-${lobbyId}`,
      JSON.stringify({
        answers,
        currentQuestion,
      }),
    );
  }, [answers, currentQuestion, lobbyId]);

  const submittingRef = useRef(false);
  function finishQuiz() {
    if (submittingRef.current) return; // prevent spam

    submittingRef.current = true;
    // send answers to server
    socket.emit("submit-quiz", {
      lobbyId,
      playerId: userId.replace(/\[.*?\]\(mailto:.*?\)/g, ""),
      answers,
    });

    let finalScore = 0;

    const normalize = (ans: string) => {
      if (!ans) return "";

      const map: Record<string, string> = {
        A: "optionA",
        B: "optionB",
        C: "optionC",
        D: "optionD",
      };

      return map[ans] ?? ans;
    };

    const reviewData = questions.map((q, i) => {
      const userAnswerKey = normalize(answers[i]);
      const correctKey = normalize(q.answer);

      const isCorrect = userAnswerKey === correctKey;

      if (isCorrect) {
        finalScore++;
      }

      const optionMap = {
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
      };

      return {
        question: q.question,

        userAnswer: userAnswerKey,
        correctAnswer: correctKey,

        userAnswerText:
          optionMap[userAnswerKey as keyof typeof optionMap] ?? "Not answered",

        correctAnswerText: optionMap[correctKey as keyof typeof optionMap],

        isCorrect,
      };
    });

    // save review page data
    localStorage.setItem(`review-${lobbyId}`, JSON.stringify(reviewData));

    setScore(finalScore);
    setQuizEnded(true);

    // wait for server confirmation
    const handleSubmitted = () => {
      socket.off("quiz-submitted", handleSubmitted);

      router.replace(`/quiz/${lobbyId}/results`);
    };

    socket.on("quiz-submitted", handleSubmitted);
  }

  function moveNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  }

  function movePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  function submitAnswer(answer: AnswerKey) {
    setAnswer(currentQuestion, answer);
  }

  // ── Background layers (shared) ──
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

  console.log("RENDER STATE", {
    loading,
    quizEnded,
    questionsLength: questions.length,
    currentQuestion,
    q,
  });

  // ── Loading ──
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

  // ── Waiting for host ──
  if (!questions.length) {
    console.log("RENDERING QUIZ UI");
    return (
      <main
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "#0a0a0a" }}
      >
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
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // FIX: timerPct — timer counts DOWN from timerMaxRef (e.g. 150 → 0)
  // bar width = (timer / max) * 100, drains left to right as timer falls
  const timerPct =
    timerMaxRef.current > 0
      ? Math.min(100, Math.max(0, (timer / timerMaxRef.current) * 100))
      : 0;

  const timerDanger = timer <= 8;

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
              {timer}s
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
              marginBottom: 16,
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

          {/* Timer Bar  */}
          <div
            style={{
              height: 5,
              background: "rgba(245,240,232,.07)",
              borderRadius: 3,
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                height: "100%",
                // drains from 100% → 0% as timer counts down
                width: `${timerPct}%`,
                background: timerDanger ? "#A32D2D" : "#ea781e",
                borderRadius: 3,
                // 1s transition matches the server tick so it drains smoothly
                transition: "width 1s linear, background .3s ease",
                boxShadow: timerDanger
                  ? "0 0 6px rgba(163,45,45,.5)"
                  : "0 0 6px rgba(234,120,30,.3)",
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
                  disabled={isSpectator}
                  onClick={() => {
                    if (isSpectator) return;

                    console.log("BUTTON CLICKED", {
                      currentQuestion,
                      option: option.key,
                      question: q?.question,
                    });

                    submitAnswer(option.key as AnswerKey);
                  }}
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

                    cursor: isSpectator ? "not-allowed" : "pointer",
                    opacity: isSpectator ? 0.65 : 1,

                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    if (isSelected || isSpectator) return;

                    const btn = e.currentTarget as HTMLButtonElement;

                    btn.style.borderColor = "rgba(234,120,30,.35)";
                    btn.style.background = "rgba(234,120,30,.06)";
                    btn.style.color = "#f5f0e8";
                  }}
                  onMouseLeave={(e) => {
                    if (isSelected || isSpectator) return;

                    const btn = e.currentTarget as HTMLButtonElement;

                    btn.style.borderColor = "rgba(245,240,232,.08)";
                    btn.style.background = "#111";
                    btn.style.color = "rgba(245,240,232,.65)";
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

                  <span style={{ flex: 1 }}>{option.value}</span>

                  {isSpectator && (
                    <span
                      style={{
                        fontSize: 10,
                        color: "rgba(245,240,232,.35)",
                        fontStyle: "italic",
                      }}
                    >
                      View Only
                    </span>
                  )}
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
