import { create } from "zustand";

export type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
};

interface QuizStore {
  questions: Question[];
  currentIndex: number;
  score: number;
  finished: boolean;
  answers: string[];

  timer: number;

  setQuestions: (questions: Question[]) => void;
  setCurrentIndex: (index: number) => void;
  setAnswer: (index: number, answer: string) => void;
  setScore: (score: number) => void;
  setFinished: (value: boolean) => void;

  setTimer: (timer: number) => void;

  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  questions: [],
  currentIndex: 0,
  score: 0,
  finished: false,
  answers: [],

  timer: 15,

  setQuestions: (questions) =>
    set({
      questions,
      currentIndex: 0,
      answers: Array(questions.length).fill(""),
      score: 0,
      finished: false,
      timer: 15,
    }),

  setCurrentIndex: (index) =>
    set({
      currentIndex: index,
    }),

  setAnswer: (index, answer) =>
    set((state) => {
      const updated = [...state.answers];
      updated[index] = answer;
      return { answers: updated };
    }),

  setScore: (score) =>
    set({
      score,
    }),

  setFinished: (value) =>
    set({
      finished: value,
    }),

  setTimer: (timer) =>
    set({
      timer,
    }),

  reset: () =>
    set({
      questions: [],
      currentIndex: 0,
      score: 0,
      finished: false,
      answers: [],
      timer: 15,
    }),
}));