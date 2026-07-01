// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useQuizStore } from "@/store/quizStore";
// import { socket } from "@/lib/socket/socket";

// export default function QuestionCard({ lobbyId }: { lobbyId: string }) {
//   const { data: session } = useSession();

// const questions = useQuizStore((s) => s.questions);
// const currentIndex = useQuizStore((s) => s.currentIndex);

//   const [selected, setSelected] = useState<string | null>(null);

//   const playerId = (session?.user as any)?.email; // safer than id

//   // reset selection when question changes
//   useEffect(() => {
//     setSelected(null);
//   }, [currentIndex]);

//   if (!questions) return null;

//   const submitAnswer = (option: string) => {
//     if (selected) return;

//     setSelected(option);

//     socket.emit("submit-answer", {
//       lobbyId,
//       playerId,
//       answer: option,
//     });
//   };

//   const options = [
//     questions.optionA,
//     questions.optionB,
//     questions.optionC,
//     questions.optionD,
//   ];

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-bold mb-4">{questions.question}</h2>

//       <div className="flex flex-col gap-3">
//         {options.map((opt, i) => {
//           const isSelected = selected === opt;

//           return (
//             <button
//               key={i}
//               onClick={() => submitAnswer(opt)}
//               disabled={!!selected}
//               className={`p-3 rounded-lg border transition ${
//                 isSelected
//                   ? "bg-green-600 text-white"
//                   : "bg-neutral-900 hover:bg-neutral-800"
//               }`}
//             >
//               {opt} {isSelected && "✓"}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
