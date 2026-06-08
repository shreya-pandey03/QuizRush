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

  console.log("QUESTION IN CARD:", question);

  const playerId = (session?.user as any)?.id;

  const submitAnswer = (option: string) => {
    if (!playerId) return;

    setSelected(option);

    socket.emit("submit-answer", {
      lobbyId,
      playerId,
      questionIndex: currentIndex,
      answer: option,
    });
  };

  const options = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ];

  return (
    <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-5 text-white space-y-4">
      <div className="text-xs text-neutral-400">Lobby: {lobbyId}</div>

      <h2 className="text-lg font-bold leading-snug">{question.question}</h2>

      <div className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const isSelected = selected === opt;

          return (
            <button
              key={i}
              onClick={() => submitAnswer(opt)}
              disabled={!!selected}
              className={`
              p-3 rounded-lg text-left transition border
              border-neutral-800
              ${
                isSelected
                  ? "bg-green-600 text-white"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }
            `}
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
