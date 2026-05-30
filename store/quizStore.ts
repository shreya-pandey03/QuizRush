import { create } from "zustand";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

interface QuizStore {
  question: Question | null;

  setQuestion: (question: Question) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  question: null,

  setQuestion: (question) =>
    set({
      question,
    }),
}));
