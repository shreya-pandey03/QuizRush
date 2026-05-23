import { create } from "zustand";

interface TimerState {
  time: number;

  setTime: (value: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  time: 30,

  setTime: (value) => {
    set({
      time: value,
    });
  },
}));
