"use client";

type ResultModalProps = {
  score: number;
  total: number;
};

export default function ResultModal({
  score,
  total,
}: ResultModalProps) {
  return (
    <div>
      <div>
        Score: {score}/{total}
      </div>
    </div>
  );
}
