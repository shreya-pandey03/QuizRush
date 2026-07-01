import { gameStore, resetLobby } from "@/lib/socket/gameStore";

export async function startQuiz(lobbyId: string, generatedQuestions: any[]) {
  resetLobby(lobbyId);

  const lobby = gameStore.get(lobbyId);

  if (lobby) {
    lobby.questions = generatedQuestions;
    lobby.currentQuestionIndex = 0;
    lobby.status = "created";
    lobby.started = false;
    lobby.timer = 0;
  }

  return {
    success: true,
    questionCount: generatedQuestions.length,
  };
}
