"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuizStore } from "@/store/quizStore";
import { socket } from "@/lib/socket/socket";

export default function QuestionCard({ lobbyId }: { lobbyId: string }) {
  const { data: session } = useSession();

  const question = useQuizStore((s) => s.question);
  const currentIndex = useQuizStore((s) => s.currentIndex);

  const [selected, setSelected] = useState<string | null>(null);

  if (!question) return null;

  const playerId = (session?.user as any)?.id;

  const submitAnswer = (option: string) => {
    setSelected(option);

    socket.emit("submit-answer", {
      lobbyId,
      playerId,
      questionIndex: currentIndex,
      answer: option, // VALUE not key
    });
  };

  const options = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ];

  return (
    <div>
      <h2>{question.question}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt, i) => {
          const isSelected = selected === opt;

          return (
            <button
              key={i}
              onClick={() => submitAnswer(opt)}
              style={{
                padding: 10,
                background: isSelected ? "green" : "#111",
                color: "white",
              }}
            >
              {opt}
              {isSelected && " ✓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}