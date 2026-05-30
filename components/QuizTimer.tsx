import { useTimerStore } from "@/store/timerStore";

export default function QuizTimer() {
  const timeLeft = useTimerStore((s) => s.timeLeft);

  return <h2>{timeLeft}</h2>;
}
