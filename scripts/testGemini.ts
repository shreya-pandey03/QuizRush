import { gameStore } from "@/lib/socket/gameStore";
import { generateQuestions } from "../lib/ai/generateQuestions";

async function main() {
  const lobbyId = "7J4LV0";

  const lobby = gameStore.get(lobbyId);

  if (!lobby) {
    console.log("Lobby not found");
    return;
  }

  const questions = await generateQuestions(
    lobby.category ?? "general",
    lobby.difficulty ?? "easy",
    10,
  );
  lobby.questions = questions;
  console.log("TOTAL QUESTIONS:", questions.length);
}

main().catch(console.error);
