"use client";

import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Question = {
  question: string;
  answer: string;
  correct: boolean;
};

export default function GameDetailsPage() {
  const [questions] = useState<Question[]>([]);
  const [score] = useState<number>(0);

  // useEffect(() => {
  //   async function loadResults() {
  //     try {
  //       const res = await fetch("/api/results"); 
  //       const data = await res.json();

  //       console.log("QUESTIONS FROM API:", data);
  //       console.log("API QUESTIONS:", data.questions);
  //       console.log("FIRST QUESTION:", data.questions[0]);

  //       setQuestions(data.questions || []);
  //       setScore(data.score || 0);
  //     } catch (err) {
  //       console.error("Failed to load results:", err);
  //     }
  //   }

  //   loadResults();
  // }, []);

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold">Game Results</h1>

      <p className="text-neutral-400 mt-2">Review your answers and scores</p>

      {/* SCORE CARD */}
      <div className="mt-8 bg-white/[0.03] p-6 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-semibold">Final Score</h2>

            <p className="text-orange-500 text-3xl font-bold mt-2">
              {score} Points
            </p>
          </div>

          <CheckCircle size={40} className="text-orange-500" />
        </div>
      </div>

      {/* QUESTIONS REVIEW */}
      <div className="space-y-4 mt-8">
        {questions.map((q, index) => (
          <div
            key={index}
            className="p-5 bg-white/[0.03] border border-white/10 rounded-xl"
          >
            <h2 className="text-white">{q.question}</h2>

            <p className="mt-2 text-neutral-400">
              Your answer:{" "}
              <span className={q.correct ? "text-green-500" : "text-red-500"}>
                {q.answer}
              </span>
            </p>

            <p
              className={
                q.correct ? "text-green-500 mt-1" : "text-red-500 mt-1"
              }
            >
              {q.correct ? "Correct" : "Incorrect"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
