"use server";

export async function SubmitAnswer(questionId: string, answer: string) {
  await fetch(
    "http://localhost:3001/api/quiz/submit",

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        questionId,
        answer,
      }),
    },
  );
}
