"use client";

import { useEffect, useState } from "react";

interface QuizTimerProps {
  initialTime?: number;
}

export default function QuizTimer({
  initialTime = 30,
}: QuizTimerProps) {

  const [time, setTime] = useState<number>(initialTime);

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

      <div className="flex items-center gap-2">

        <h2 className="text-white font-semibold text-lg">
          ⏱ Quiz Timer
        </h2>

      </div>

      <p className="text-3xl text-orange-500 mt-4 font-bold">
        {time}s
      </p>

    </div>
  );
}