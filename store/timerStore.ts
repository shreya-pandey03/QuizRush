import { create } from "zustand";

export const timers = new Map<string, NodeJS.Timeout>();

interface TimerStore {
  timeLeft: number;

  setTimeLeft: (time: number) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  timeLeft: 15,

  setTimeLeft: (time) =>
    set({
      timeLeft: time,
    }),
}));
