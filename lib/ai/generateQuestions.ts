import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export type GeneratedQuestion = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "optionA" | "optionB" | "optionC" | "optionD";
};

export async function generateQuestions(
  category: string,
  difficulty: string,
  count = 10,
  seed?: number,
): Promise<GeneratedQuestion[]> {
  const prompt = `
Generate ${count} multiple choice questions.

Category: ${category}
Difficulty: ${difficulty}
Seed: ${seed ?? "random"}

Return ONLY valid JSON array.

Each question MUST have:

{
  "question": "...",
  "optionA": "...",
  "optionB": "...",
  "optionC": "...",
  "optionD": "...",
  "answer": "optionA"
}

IMPORTANT:
answer must ONLY be:
optionA
optionB
optionC
optionD

Do NOT return the actual answer text.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    console.log("AI QUESTIONS:", parsed);

    return parsed.map((q: any) => ({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      answer: q.answer,
    }));
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return [
      {
        question: "What is the capital of India?",
        optionA: "Mumbai",
        optionB: "Delhi",
        optionC: "Chennai",
        optionD: "Kolkata",
        answer: "optionB",
      },
      {
        question: "2 + 2 = ?",
        optionA: "2",
        optionB: "3",
        optionC: "4",
        optionD: "5",
        answer: "optionC",
      },
    ];
  }
}