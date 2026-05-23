"use client";

import { useEffect } from "react";

import { useTimerStore } from "@/store/timerStore";

export default function useTimer() {
  const { time, setTime } = useTimerStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);
}
