import { create } from "zustand";

type Question = {
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  question: string;
  answer: string;
};

interface QuizStore {
  questions: Question[];
  currentIndex: number;
  question: Question | null;
  score: number;
  finished: boolean;
  answers: string[];

  setQuestions: (questions: Question[]) => void;
  setQuestion: (question: Question | null) => void;

  nextQuestion: () => void;
  addScore: () => void;

  setAnswer: (index: number, answer: string) => void;

  setFinished: (value: boolean) => void;

  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentIndex: 0,
  question: null,
  score: 0,
  finished: false,
  answers: [],

  setQuestions: (questions) =>
    set({
      questions,
      question: questions[0] || null,
      currentIndex: 0,
      finished: false,
      score: 0,
      answers: [],
    }),

  setQuestion: (question) => set({ question }),

  setAnswer: (index, answer) =>
    set((state) => {
      const updated = [...state.answers];
      updated[index] = answer;
      return { answers: updated };
    }),

  setFinished: (value) => set({ finished: value }),

  nextQuestion: () => {
    const { questions, currentIndex } = get();

    const next = currentIndex + 1;

    if (next >= questions.length) {
      set({
        finished: true,
        question: null,
      });
      return;
    }

    set({
      currentIndex: next,
      question: questions[next],
    });
  },

  addScore: () =>
    set((state) => ({
      score: state.score + 1,
    })),

  reset: () =>
    set({
      questions: [],
      currentIndex: 0,
      question: null,
      score: 0,
      finished: false,
      answers: [],
    }),
}));
