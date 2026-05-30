import { create } from "zustand";

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
