"use client";

import { useEffect, useState } from "react";

interface QuizTimerProps {
  initialTime: number;
}

export default function QuizTimer({
  initialTime,
}: QuizTimerProps) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-white font-semibold">
        Quiz Timer
      </h2>

      <p className="text-2xl text-orange-500 mt-2">
        ⏱ {time}s
      </p>
    </div>
  );
}