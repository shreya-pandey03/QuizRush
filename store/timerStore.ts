import { create } from "zustand";

interface TimerStore {
  timeLeft: number;

  setTimeLeft: (time: number) => void;

  reset: () => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  timeLeft: 0,

  setTimeLeft: (time) =>
    set({
      timeLeft: time,
    }),

  reset: () =>
    set({
      timeLeft: 0,
    }),
}));
