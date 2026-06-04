"use client";

import { useTimerStore } from "@/store/timerStore";
import { Clock } from "lucide-react";

export default function QuizTimer() {
  const timeLeft = useTimerStore((s) => s.timeLeft);

  return (
    <div className="text-center">
      <p className="text-neutral-400 text-sm flex items-center justify-center gap-1">
        <Clock size={14} />
        Quiz Timer
      </p>

      <h2 className="text-4xl font-bold text-orange-500">
        {timeLeft}s
      </h2>
    </div>
  );
}