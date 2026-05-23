import { create } from "zustand";

interface QuizState {
  question: string;

  score: number;

  setQuestion: (value: string) => void;

  setScore: (value: number) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  question: "",

  score: 0,

  setQuestion: (value) => {
    set({
      question: value,
    });
  },

  setScore: (value) => {
    set({
      score: value,
    });
  },
}));
