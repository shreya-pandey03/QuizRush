"use server";

export function CalculateScore(correct: boolean, time: number) {
  if (!correct) {
    return 0;
  }

  return Math.max(100 - time, 10);
}
