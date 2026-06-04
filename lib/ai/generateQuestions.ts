import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateQuestions(
  category: string,
  difficulty: string,
  count = 10
) {
  const prompt = `
Generate ${count} multiple choice questions.

Category: ${category}
Difficulty: ${difficulty}

Return ONLY valid JSON.

[
  {
    "question":"...",
    "optionA":"...",
    "optionB":"...",
    "optionC":"...",
    "optionD":"...",
    "answer":"..."
  }
]
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

  return JSON.parse(cleaned);
}