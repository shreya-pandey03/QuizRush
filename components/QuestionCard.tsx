"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuizStore } from "@/store/quizStore";
import { socket } from "@/lib/socket/socket";

export default function QuestionCard({ lobbyId }: { lobbyId: string }) {
  const { data: session } = useSession();

  const [answered, setAnswered] = useState(false);

  const question = useQuizStore((s) => s.question);

  if (!question) return null;

  const playerId = (session?.user as any)?.id;

  const submitAnswer = (answer: string) => {
    socket.emit("submit-answer", {
      lobbyId,
      playerId,
      answer,
    });

    setAnswered(true);
  };

  return (
    <div>
      <h2>{question.question}</h2>

      {question.options.map((option) => (
        <button
          key={option}
          disabled={answered}
          onClick={() => submitAnswer(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
