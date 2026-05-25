"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";

import { Clock, ChevronRight, ChevronLeft, Trophy } from "lucide-react";

export default function QuizPage() {
  const params = useParams();

  const lobbyId =
  Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : String(params.lobbyId);

console.log("Quiz room:", lobbyId);

  const roomId = String(params.lobbyId);

  // replace later with session user id
  const userId = "player123";

  const socketRef = useRef<Socket | null>(null);

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

    const socket = socketRef.current;

    socket.emit("joinRoom", roomId);

    socket.on("timerUpdate", (time) => {
      setTimeLeft(time);
    });

    socket.on("questionChanged", (data) => {
      if (data.questionIndex >= questions.length) {
        finishQuiz();

        return;
      }

      setCurrentQuestion(data.questionIndex);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
    socketRef.current?.emit("nextQuestion", roomId);
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
            <Trophy size={50} className="mx-auto text-orange-500" />

            <h1 className="text-white text-center text-4xl font-bold mt-4">
              Quiz Finished
            </h1>

            <p className="text-orange-500 text-center text-3xl font-bold mt-6">
              Score: {score}/{questions.length}
            </p>
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
                className={`w-full p-4 rounded-xl border transition

                  ${
                    answers[currentQuestion] === option
                      ? "bg-orange-500 border-orange-500"
                      : "bg-black border-white/10 hover:border-orange-500"
                  }

                  text-white`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              className="flex-1 py-4 border border-white/10 rounded-xl text-white"
            >
              <div className="flex justify-center gap-2">
                <ChevronLeft size={18} />
                Previous
              </div>
            </button>

            <button
              onClick={moveNext}
              className="flex-1 bg-orange-500 hover:bg-orange-600 py-4 rounded-xl text-white font-semibold"
            >
              <div className="flex justify-center gap-2">
                Next Question
                <ChevronRight size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
