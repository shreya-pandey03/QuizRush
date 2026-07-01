import { db } from "@/drizzle/src/db";
import { gameStore, Spectator } from "@/lib/socket/gameStore";
import type {
  JoinLobbyPayload,
  JoinSpectatorPayload,
  RejoinLobbyPayload,
} from "@/types/socket";
import { eq } from "drizzle-orm";
import { lobbies } from "@/drizzle/src/db/schema";
import { generateQuestions } from "../ai/generateQuestions";
import { startQuizTimer } from "./timers";
import { emitLobbyList } from "./lobbyBroadcaster";

export async function lobbyHandlers(io: any, socket: any) {
  async function sendActiveLobbies() {
    // const lobbies = await db.query.lobbies.findMany({
    //   where: (l, { eq }) => eq(l.isStarted, false),
    // });
    const lobbies = await db.query.lobbies.findMany();

    console.log("ALL LOBBIES:", lobbies);
    console.log("ACTIVE LOBBIES FROM DB:", lobbies);
    io.emit("activeLobbiesUpdated", lobbies);
  }

  socket.on("request-active-lobbies", async () => {
    console.log("REQUEST ACTIVE LOBBIES RECEIVED");

    await sendActiveLobbies();
  });

  socket.on("create-lobby", async () => {
    await sendActiveLobbies();
  });

  socket.on(
    "leave-lobby",
    async ({ lobbyId, playerId }: RejoinLobbyPayload) => {
      const lobby = gameStore.get(lobbyId);
      if (!lobby) return;
      lobby.players = lobby.players.filter((p) => p.id !== playerId);
      gameStore.set(lobbyId, lobby);
      await sendActiveLobbies();
      lobby.lastActivity = Date.now();
    },
  );

  socket.on("join-lobby", async (payload: JoinLobbyPayload) => {
    try {
      const { lobbyId, player } = payload;

      console.log("USER JOINED ROOM:", socket.id, lobbyId);

      let lobby = gameStore.get(lobbyId);

      // Load from DB if not already in memory
      if (!lobby) {
        const dbLobby = await db.query.lobbies.findFirst({
          where: eq(lobbies.code, lobbyId),
        });

        if (!dbLobby?.code) {
          socket.emit("error", "Lobby not found");
          return;
        }

        lobby = {
          id: lobbyId,
          lobbyId,
          hostName: dbLobby.hostName,

          players: [],

          started: false,
          locked: false,
          status: "waiting",

          questions: [],
          currentQuestionIndex: 0,

          timer: 0,

          category: dbLobby.category ?? "General",
          difficulty: dbLobby.difficulty ?? "Easy",

          answers: {},
          scores: {},

          correctAnswers: {},
          bonuses: {},

          startTime: undefined,
          endTime: undefined,
          duration: undefined,

          ready: {},
          submitted: new Set<string>(),
          submittedAt: {},

          createdAt: Date.now(),
          lastActivity: Date.now(),

          answerOrder: [],

          spectators: [],
        };

        gameStore.set(lobbyId, lobby);
      }

      const existingPlayer = lobby.players.find((p) => p.id === player.id);

      // Running quiz + new user -> spectator only
      if (lobby.started && !existingPlayer) {
        console.log("NEW USER TRIED TO JOIN RUNNING QUIZ:", player.name);

        socket.emit("must-spectate");
        return;
      }

      // Full lobby
      if (!existingPlayer && lobby.players.length >= 10) {
        socket.emit("must-spectate");
        return;
      }

      socket.join(lobbyId);

      socket.data.lobbyId = lobbyId;
      socket.data.playerId = player.id;

      lobby.lastActivity = Date.now();

      // Reconnection
      if (existingPlayer) {
        existingPlayer.socketId = socket.id;
        existingPlayer.online = true;
      }
      // New player
      else {
        lobby.players.push({
          id: player.id,
          name: player.name,
          photo: player.photo ?? null,
          score: 0,
          answered: false,
          socketId: socket.id,
          online: true,
        });
      }

      // Full leaderboard object
      const leaderboard = lobby.players
        .map((p) => ({
          id: p.id,
          name: p.name,
          score: lobby.scores?.[p.id] ?? 0,
          correctAnswers: lobby.correctAnswers?.[p.id] ?? 0,
          bonus: lobby.bonuses?.[p.id] ?? 0,
          photo: p.photo,
        }))
        .sort((a, b) => {
          if (b.score === a.score) {
            return (b.bonus ?? 0) - (a.bonus ?? 0);
          }
          return b.score - a.score;
        });

      gameStore.set(lobbyId, lobby);

      emitLobbyList(io);

      // Restore leaderboard after refresh/reconnect
      socket.emit("leaderboard-update", leaderboard);

      // Update everyone in lobby
      io.to(lobbyId).emit(
        "players-update",
        [...lobby.players].sort((a, b) => b.score - a.score),
      );

      // Rejoin running quiz
      if (lobby.started && lobby.questions.length > 0) {
        socket.emit("quiz-resync", {
          lobbyId,
          questions: lobby.questions,
          startTime: lobby.startTime,
          endTime: lobby.endTime,
          duration: lobby.duration,
          currentQuestionIndex: lobby.currentQuestionIndex,
        });

        socket.emit("leaderboard-update", leaderboard);
      }
    } catch (err) {
      console.error("JOIN LOBBY ERROR:", err);
    }
  });

  //  socket.on("start-quiz", async ({ lobbyId }: JoinLobbyPayload) => {

  socket.on("start-quiz", async ({ lobbyId }: JoinLobbyPayload) => {
    const existingLobby = gameStore.get(lobbyId);

    if (existingLobby?.started) {
      console.log("QUIZ ALREADY STARTED:", lobbyId);
      return;
    }

    console.log("START QUIZ:", lobbyId);
    const dbLobby = await db
      .select()
      .from(lobbies)
      .where(eq(lobbies.code, lobbyId));

    if (!dbLobby.length) return;

    const oldLobby = gameStore.get(lobbyId);

    const questions = await generateQuestions(
      dbLobby[0].category ?? "General",
      dbLobby[0].difficulty ?? "Easy",
      10,
    );

    const lobby = gameStore.get(lobbyId);
    if (lobby) {
      lobby.lastActivity = Date.now();
    }

    const startTime = Date.now();
    const duration = questions.length * 15;
    const endTime = startTime + duration * 1000;

    gameStore.set(lobbyId, {
      id: dbLobby[0].id,
      lobbyId,
      hostName: dbLobby[0]?.hostName ?? "Unknown",
      players: oldLobby?.players ?? [],
      questions,
      started: true,
      locked: false,
      status: "playing",
      currentQuestionIndex: 0,
      timer: 15,
      category: dbLobby[0]?.category ?? "General",
      difficulty: dbLobby[0]?.difficulty ?? "Easy",
      answers: {},
      scores: {},
      startTime,
      endTime,
      duration,
      ready: oldLobby?.ready ?? {},
      createdAt: oldLobby?.createdAt ?? Date.now(),
      lastActivity: Date.now(),
      submitted: new Set<string>(),
      submittedAt: {},
      answerOrder: [],
      spectators: oldLobby?.spectators ?? [],
      correctAnswers: {},
      bonuses: {},
    });

    startQuizTimer(io, lobbyId);

    io.to(lobbyId).emit("quiz-started", {
      lobbyId,
      questions,
      currentQuestionIndex: 0,
      status: "playing",
      startTime,
      endTime,
      duration,
    });

    console.log("QUIZ STARTED:", lobbyId);
  });

  socket.on("disconnect", () => {
    const lobbyId = socket.data.lobbyId;
    const playerId = socket.data.playerId;

    if (!lobbyId || !playerId) return;

    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    const player = lobby.players.find((p) => p.id === playerId);

    if (!player) return;

    // Ignore disconnects from old sockets
    if (player.socketId !== socket.id) {
      console.log("IGNORING OLD SOCKET DISCONNECT", player.name, socket.id);
      return;
    }

    player.online = false;
    delete player.socketId;

    lobby.lastActivity = Date.now();

    gameStore.set(lobbyId, lobby);

    console.log("PLAYER OFFLINE:", player.name);

    io.to(lobbyId).emit("players-update", lobby.players);
  });
  //socket.on("rejoin-lobby", ({ lobbyId, playerId }: RejoinLobbyPayload) => {

  socket.on("rejoin-lobby", ({ lobbyId, playerId }: RejoinLobbyPayload) => {
    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    const player = lobby.players.find((p) => p.id === playerId);

    if (!player) {
      console.log("REJOIN FAILED - PLAYER NOT FOUND:", playerId);
      return;
    }

    player.online = true;
    player.socketId = socket.id;

    socket.join(lobbyId);

    socket.emit("rejoin-success", {
      lobby,
    });
    const leaderboard = lobby.players
      .map((p) => ({
        id: p.id,
        name: p.name,
        score: lobby.scores?.[p.id] ?? 0,
        correctAnswers: lobby.correctAnswers?.[p.id] ?? 0,
        bonus: lobby.bonuses?.[p.id] ?? 0,
        photo: p.photo,
      }))
      .sort((a, b) => {
        if (b.score === a.score) {
          return (b.bonus ?? 0) - (a.bonus ?? 0);
        }
        return b.score - a.score;
      });

    socket.emit("leaderboard-update", leaderboard);

    console.log("PLAYER REJOINED:", player.name, lobbyId);
  });

  socket.on("request-quiz-state", async ({ lobbyId }: JoinLobbyPayload) => {
    const lobby = gameStore.get(lobbyId);

    if (!lobby) return;

    socket.emit("quiz-resync", {
      questions: lobby.questions,
      currentQuestionIndex: lobby.currentQuestionIndex,
    });
  });

  socket.on(
    "join-spectator",
    ({ lobbyId, spectator }: JoinSpectatorPayload) => {
      const lobby = gameStore.get(lobbyId);

      if (!lobby) return;

      if (!lobby.spectators) {
        lobby.spectators = [];
      }

      const existing = lobby.spectators.find((s) => s.id === spectator.id);

      if (!existing) {
        lobby.spectators.push({
          ...spectator,
          socketId: socket.id,
        });
      }

      gameStore.set(lobbyId, lobby);

      io.to(lobbyId).emit("spectators-update", lobby.spectators);

      socket.emit("spectator-mode");

      console.log("SPECTATOR JOINED:", spectator.name);
    },
  );
}
