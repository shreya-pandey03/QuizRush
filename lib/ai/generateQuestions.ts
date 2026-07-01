import { GoogleGenAI } from "@google/genai";
import { topicTemplates } from "./topicTemplates";

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

const fallbackQuestions: GeneratedQuestion[] = [
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
    question: "Which ocean is the largest?",
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
  {
    question: "What is the capital of India?",
    optionA: "Mumbai",
    optionB: "Delhi",
    optionC: "Kolkata",
    optionD: "Chennai",
    answer: "optionB",
  },
  {
    question: "Which gas do plants absorb?",
    optionA: "Oxygen",
    optionB: "Nitrogen",
    optionC: "Carbon Dioxide",
    optionD: "Hydrogen",
    answer: "optionC",
  },
];

export async function generateQuestions(
  category: string,
  difficulty: string,
  count = 10,
  seed?: number,
): Promise<GeneratedQuestion[]> {
  const topic = category.toLowerCase() as keyof typeof topicTemplates;

  const template = topicTemplates[topic] ?? {
    description: `Questions about ${category}`,
    rules: `Generate questions strictly related to ${category}.`,
  };

  const prompt = `
You are a professional quiz generator for a multiplayer game.

Topic: ${category}
Difficulty: ${difficulty}
Description: ${template.description}
Rules: ${template.rules}

Generate ${count} multiple choice questions.

IMPORTANT RULES:
- Questions must strictly follow the topic rules
- Difficulty must match (${difficulty})
- No explanations
- Only valid JSON

Return ONLY JSON array:

[
  {
    "question": "...",
    "optionA": "...",
    "optionB": "...",
    "optionC": "...",
    "optionD": "...",
    "answer": "optionA"
  }
]
`;

  try {
    let response: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`GEMINI ATTEMPT ${attempt}`);

        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        break;
      } catch (error) {
        console.error(`GEMINI ATTEMPT ${attempt} FAILED`, error);

        if (attempt === 3) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    const text = response?.text ?? "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }

    const questions: GeneratedQuestion[] = parsed.map((q: any) => ({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      answer: q.answer,
    }));

    console.log("RETURNING AI QUESTIONS:", questions.length);

    return questions;
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    console.log("RETURNING FALLBACK QUESTIONS:", count);

    return fallbackQuestions.slice(0, count);
  }
}
