import { db } from "@/drizzle/src/db";
import {questions } from "@/drizzle/src/db/schema";


async function seed() {
  await db
    .insert(questions)

    .values([
      {
        question: "What is React?",

        optionA: "Library",

        optionB: "Database",

        optionC: "Server",

        optionD: "Language",

        answer: "Library",
      },

      {
        question: "What is Next.js?",

        optionA: "Framework",

        optionB: "Database",

        optionC: "Browser",

        optionD: "OS",

        answer: "Framework",
      },
    ]);

  console.log("Questions Seeded");
}

seed();
