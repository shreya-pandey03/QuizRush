import { Server, Socket } from "socket.io";
import { gameStore } from "./gameStore";
import { achievements, gameHistory, userStats } from "@/drizzle/src/db/schema";
import { db } from "@/drizzle/src/db";
import { eq } from "drizzle-orm";
import { timers } from "./timers";

export function scoreHandlers(io: Server, socket: Socket) {
  socket.on("submit-quiz", async ({ lobbyId, playerId, answers }) => {
    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    const player = lobby.players.find((p) => p.id === playerId);

    if (!player) return;

    // INIT

    if (!lobby.answers) lobby.answers = {};
    if (!lobby.scores) lobby.scores = {};
    if (!lobby.submitted) lobby.submitted = new Set<string>();
    if (!lobby.submittedAt) lobby.submittedAt = {};
    if (!lobby.answerOrder) lobby.answerOrder = [];

    // RATE LIMIT

    if (Date.now() - (lobby.submittedAt[playerId] || 0) < 500) {
      console.log("RATE LIMIT BLOCKED");
      return;
    }

    lobby.submittedAt[playerId] = Date.now();

    // DUPLICATE BLOCK

    if (lobby.submitted.has(playerId)) {
      console.log("DUPLICATE SUBMIT BLOCKED");
      return;
    }

    lobby.submitted.add(playerId);

    // SAVE ANSWERS

    lobby.answers[playerId] = answers;

    // SCORE CALCULATION

    let score = 0;

    lobby.questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        score++;
      }
    });

    // bonus calculation
    if (!lobby.answerOrder.includes(playerId)) {
      lobby.answerOrder.push(playerId);
    }

    const place = lobby.answerOrder.indexOf(playerId);

    let bonus = 0;

    if (place === 0) bonus = 5;
    if (place === 1) bonus = 3;
    if (place === 2) bonus = 1;

    const finalScore = score + bonus;

    // save all score data
    if (!lobby.correctAnswers) lobby.correctAnswers = {};
    if (!lobby.bonuses) lobby.bonuses = {};

    lobby.correctAnswers[playerId] = score;
    lobby.bonuses[playerId] = bonus;
    lobby.scores[playerId] = finalScore;

    player.score = finalScore;

    gameStore.set(lobbyId, lobby);

    // LEADERBOARD

    const leaderboard = lobby.players
      .map((p) => ({
        id: p.id,
        name: p.name,
        photo: p.photo,
        score: lobby.scores?.[p.id] ?? 0,
        correctAnswers: lobby.correctAnswers?.[p.id] ?? 0,
        bonus: lobby.bonuses?.[p.id] ?? 0,
      }))
      .sort((a, b) => {
        if (b.score === a.score) {
          return (b.bonus ?? 0) - (a.bonus ?? 0);
        }
        return b.score - a.score;
      });

    io.to(lobbyId).emit("leaderboard-update", leaderboard);

    // WINNER INFO

    const highestScore = Math.max(...leaderboard.map((p) => p.score));

    const rank = leaderboard.findIndex((p) => p.id === playerId) + 1;

    const isWinner = finalScore === highestScore;

    // USER STATS

    try {
      const existing = await db.query.userStats.findFirst({
        where: (t, { eq }) => eq(t.userId, playerId),
      });

      const gamesPlayed = (existing?.gamesPlayed ?? 0) + 1;

      const totalScore = (existing?.totalScore ?? 0) + finalScore;

      const totalQuestions = lobby.questions.length;

      const matchAccuracy =
        totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

      const previousAccuracyTotal =
        (existing?.accuracy ?? 0) * (existing?.gamesPlayed ?? 0);

      const accuracy = Math.round(
        (previousAccuracyTotal + matchAccuracy) / gamesPlayed,
      );

      const wins = (existing?.wins ?? 0) + (isWinner ? 1 : 0);

      const winRate =
        gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

      const xpGain = finalScore * 10;

      const newXp = (existing?.xp ?? 0) + xpGain;

      const level = Math.floor(newXp / 100) + 1;

      if (existing) {
        await db
          .update(userStats)
          .set({
            gamesPlayed,
            totalScore,
            accuracy,
            wins,
            winRate,
            xp: newXp,
            level,
          })
          .where(eq(userStats.userId, playerId));
      } else {
        await db.insert(userStats).values({
          userId: playerId,
          gamesPlayed,
          totalScore,
          accuracy,
          wins,
          winRate,
          xp: newXp,
          level,
        });
      }
    } catch (err) {
      console.error("USER STATS UPDATE FAILED", err);
    }

    // GAME HISTORY

    try {
      await db.insert(gameHistory).values({
        id: crypto.randomUUID(),
        lobbyId,
        userId: playerId,
        score: finalScore,
        totalQuestions: lobby.questions.length,
        rank,
        isWinner,
      });
    } catch (err) {
      console.error("GAME HISTORY FAILED", err);
    }

    // ACHIEVEMENTS
    try {
      const existingAchievements = await db
        .select()
        .from(achievements)
        .where(eq(achievements.userId, playerId));

      const unlocked = new Set(existingAchievements.map((a) => a.badge));

      // Perfect Score
      if (score === lobby.questions.length && !unlocked.has("Perfect Score")) {
        await db.insert(achievements).values({
          userId: playerId,
          badge: "Perfect Score",
        });

        unlocked.add("Perfect Score");
      }

      // Quiz Master
      if (
        score >= Math.ceil(lobby.questions.length * 0.8) &&
        !unlocked.has("Quiz Master")
      ) {
        await db.insert(achievements).values({
          userId: playerId,
          badge: "Quiz Master",
        });

        unlocked.add("Quiz Master");
      }

      // Good Try
      if (
        score >= Math.ceil(lobby.questions.length * 0.5) &&
        !unlocked.has("Good Try")
      ) {
        await db.insert(achievements).values({
          userId: playerId,
          badge: "Good Try",
        });

        unlocked.add("Good Try");
      }

      // Practice Mode
      if (
        score < Math.ceil(lobby.questions.length * 0.5) &&
        !unlocked.has("Practice Mode")
      ) {
        await db.insert(achievements).values({
          userId: playerId,
          badge: "Practice Mode",
        });

        unlocked.add("Practice Mode");
      }

      // Champion
      if (isWinner && !unlocked.has("Champion")) {
        await db.insert(achievements).values({
          userId: playerId,
          badge: "Champion",
        });
      }
    } catch (err) {
      console.error("ACHIEVEMENT ERROR", err);
    }

    // RESPONSE

    socket.emit("quiz-submitted", {
      score: finalScore,
      bonus,
    });

    // FINISH EARLY

    const realPlayers = lobby.players.length;

    const everyoneSubmitted = lobby.submitted.size >= realPlayers;

    if (everyoneSubmitted) {
      const timer = timers.get(lobbyId);

      if (timer) {
        clearInterval(timer);
        timers.delete(lobbyId);
      }

      lobby.status = "finished";
      lobby.started = false;
      lobby.lastActivity = Date.now();

      gameStore.set(lobbyId, lobby);

      io.to(lobbyId).emit("quiz-ended", {
        leaderboard,
        reason: "all-submitted",
      });

      console.log("QUIZ ENDED EARLY");
    }
  });
}
