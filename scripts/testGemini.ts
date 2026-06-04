import { generateQuestions } from "../lib/ai/generateQuestions";

async function main() {
  const questions = await generateQuestions(
    "Science",
    "Medium",
    5
  );

  console.log(JSON.stringify(questions, null, 2));
}

main();