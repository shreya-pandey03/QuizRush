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

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Invalid JSON from Gemini");
    }

    console.log("AI QUESTIONS:", parsed);

    console.log("GENERATED QUESTIONS COUNT:", parsed.length);

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
      {
        question: "Which planet is known as the Red Planet?",
        optionA: "Earth",
        optionB: "Mars",
        optionC: "Venus",
        optionD: "Jupiter",
        answer: "optionB",
      },
      {
        question: "How many days are in a week?",
        optionA: "5",
        optionB: "6",
        optionC: "7",
        optionD: "8",
        answer: "optionC",
      },
      {
        question: "Which animal is called King of the Jungle?",
        optionA: "Tiger",
        optionB: "Lion",
        optionC: "Elephant",
        optionD: "Bear",
        answer: "optionB",
      },
      {
        question: "What color do you get from blue + yellow?",
        optionA: "Purple",
        optionB: "Orange",
        optionC: "Green",
        optionD: "Red",
        answer: "optionC",
      },
      {
        question: "What is H2O?",
        optionA: "Oxygen",
        optionB: "Water",
        optionC: "Hydrogen",
        optionD: "Salt",
        answer: "optionB",
      },
      {
        question: "Which ocean is largest?",
        optionA: "Atlantic",
        optionB: "Indian",
        optionC: "Pacific",
        optionD: "Arctic",
        answer: "optionC",
      },
      {
        question: "How many sides does a triangle have?",
        optionA: "3",
        optionB: "4",
        optionC: "5",
        optionD: "6",
        answer: "optionA",
      },
      {
        question: "Which sense organ is used to see?",
        optionA: "Ear",
        optionB: "Nose",
        optionC: "Eye",
        optionD: "Tongue",
        answer: "optionC",
      },
    ];
  }
}
