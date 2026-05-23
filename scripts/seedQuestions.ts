import { db } from "../drizzle/db.ts"
import { questions } from "../drizzle/db/schema.ts"

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
