import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateQuestions(
category: string, difficulty: string, count = 10, seed: number) {
  const prompt = `
Generate ${count} multiple choice questions.

Category: ${category}
Difficulty: ${difficulty}

Return ONLY valid JSON.

Each question MUST have:
- question
- optionA
- optionB
- optionC
- optionD
- answer (must be ONE OF: optionA | optionB | optionC | optionD)
`;

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

  return parsed.map((q: any) => ({
    question: q.question,
    options: [
      q.optionA,
      q.optionB,
      q.optionC,
      q.optionD,
    ],
    answer: q.answer,
  }));
}