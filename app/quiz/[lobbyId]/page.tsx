"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";

import { Clock, ChevronRight, ChevronLeft, Trophy } from "lucide-react";

export default function QuizPage() {
  const params = useParams();

  const roomId = Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : String(params.lobbyId);

  const userId = "player123";

  const socketRef = useRef<Socket | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions = [
    {
      question: "What is the capital of India?",
      options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
      answer: "Delhi",
    },

    {
      question: "2 + 2 = ?",
      options: ["2", "4", "8", "10"],
      answer: "4",
    },

    {
      question: "Largest planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: "Jupiter",
    },

    {
      question: "HTML stands for?",
      options: [
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyper Tool",
        "Markup Text",
      ],
      answer: "Hyper Text Markup Language",
    },

    {
      question: "React created by?",
      options: ["Google", "Meta", "Microsoft", "Netflix"],
      answer: "Meta",
    },

    {
      question: "5 × 6 = ?",
      options: ["30", "40", "20", "10"],
      answer: "30",
    },

    {
      question: "Fastest animal?",
      options: ["Lion", "Tiger", "Cheetah", "Elephant"],
      answer: "Cheetah",
    },

    {
      question: "CSS used for?",
      options: ["Database", "Styling", "Backend", "Authentication"],
      answer: "Styling",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );

  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);

  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    socketRef.current = io("http://localhost:3002");

    socketRef.current.emit("joinRoom", roomId);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (quizEnded) return;

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
  }, [currentQuestion, quizEnded]);

  function finishQuiz() {
    let finalScore = 0;

    answers.forEach((answer, index) => {
      if (answer === questions[index].answer) {
        finalScore++;
      }
    });

    setScore(finalScore);

    setQuizEnded(true);
  }

  function moveNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);

      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  }

  function movePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);

      setTimeLeft(30);
    }
  }

  function submitAnswer(option: string) {
    const newAnswers = [...answers];

    newAnswers[currentQuestion] = option;

    setAnswers(newAnswers);

    socketRef.current?.emit("submitAnswer", {
      roomId,
      userId,

      correct: option === questions[currentQuestion].answer,
    });
  }

  if (quizEnded) {
    return (
      <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
            <Trophy size={60} className="mx-auto text-orange-500" />

            <h1 className="text-center text-white text-4xl font-bold mt-4">
              Quiz Finished
            </h1>

            <p className="text-center text-orange-500 text-3xl font-bold mt-4">
              Score: {score}/{questions.length}
            </p>

            <div className="space-y-5 mt-10">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="bg-black p-5 rounded-xl border border-white/10"
                >
                  <p className="text-white font-medium">
                    {index + 1}. {q.question}
                  </p>

                  <div className="space-y-2 mt-4">
                    {q.options.map((option) => (
                      <div
                        key={option}
                        className={`p-3 rounded-lg

      ${
        option === q.answer
          ? "bg-green-600"
          : option === answers[index] && answers[index] !== q.answer
            ? "bg-red-600"
            : "bg-white/5"
      }

      text-white
      `}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          <div className="flex justify-between">
            <h1 className="text-white text-3xl font-bold">Quiz Started 🚀</h1>

            <div className="flex items-center gap-2 text-orange-500">
              <Clock size={18} />
              {timeLeft}s
            </div>
          </div>

          <p className="text-neutral-400 mt-3">
            Question {currentQuestion + 1}/{questions.length}
          </p>

          <h2 className="text-white text-xl mt-10">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4 mt-6">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => submitAnswer(option)}
                className={`w-full p-4 rounded-xl border

    ${
      answers[currentQuestion] === option
        ? "bg-orange-500 border-orange-500"
        : "bg-black border-white/10 hover:border-orange-500"
    }

    text-white transition`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={movePrevious}
              disabled={currentQuestion === 0}
              className="flex-1 border border-white/10 rounded-xl py-4 text-white disabled:opacity-50"
            >
              <div className="flex justify-center gap-2">
                <ChevronLeft size={18} />
                Previous
              </div>
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={finishQuiz}
                className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl py-4 text-white font-semibold"
              >
                Submit Quiz ✅
              </button>
            ) : (
              <button
                onClick={moveNext}
                className="flex-1 bg-orange-500 hover:bg-orange-600 rounded-xl py-4 text-white font-semibold"
              >
                <div className="flex justify-center gap-2">
                  Next Question
                  <ChevronRight size={18} />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
