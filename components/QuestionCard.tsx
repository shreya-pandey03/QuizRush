import { useQuizStore } from "@/store/quizStore";

export default function QuestionCard() {
  const question = useQuizStore((s) => s.question);

  if (!question) return null;

  return (
    <div>
      <h2>{question.question}</h2>

      {question.options.map((option: string) => (
        <button key={option}>{option}</button>
      ))}
    </div>
  );
}
