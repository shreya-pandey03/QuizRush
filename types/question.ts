

export type AnswerKey =
  | "optionA"
  | "optionB"
  | "optionC"
  | "optionD";

export interface Question {
  id: string;
  question: string;

  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;

  answer: AnswerKey;
}