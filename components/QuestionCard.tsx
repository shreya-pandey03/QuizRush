interface QuestionCardProps {
  lobbyId: string;
}

export default function QuestionCard({
  lobbyId,
}: QuestionCardProps) {
  return (
    <div className="rounded-xl bg-white/5 p-4 text-white">
      Question
    </div>
  );
}