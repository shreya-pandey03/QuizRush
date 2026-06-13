export type Player = {
  id: string;
  name: string;
  score: number;
  answered: boolean;
};

export type AnswerKey = "optionA" | "optionB" | "optionC" | "optionD";

export type Question = {
  question: string;

  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;

  answer: AnswerKey;
};
