import QuestionOptions from "./QuestionOptions";

export default function QuestionCard() {
  return (
    <div
      className="
border
p-5
rounded
"
    >
      <h2>What is React?</h2>

      <QuestionOptions />
    </div>
  );
}
