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
  setFinished(arg0: boolean): unknown;
  questions: Question[];
  currentIndex: number;
  question: Question | null;
  score: number;
  finished: boolean;

  answers: string[];

  setQuestions: (questions: Question[]) => void;
  setQuestion: (question: Question) => void;

  nextQuestion: () => void;
  addScore: () => void;

  setAnswer: (index: number, answer: string) => void;

  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentIndex: 0,

  question: null,

  score: 0,
  finished: false,

  //  important for result screen
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

  setQuestion: (question) =>
    set({
      question,
    }),

  // store answer per question
  setAnswer: (index, answer) =>
    set((state) => {
      const updated = [...state.answers];
      updated[index] = answer;
      return { answers: updated };
    }),

  nextQuestion: () => {
    const { questions, currentIndex } = get();

    console.log("CURRENT:", currentIndex);
    console.log("TOTAL:", questions.length);

    const next = currentIndex + 1;

    if (next >= questions.length) {
      console.log("QUIZ FINISHED");

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
