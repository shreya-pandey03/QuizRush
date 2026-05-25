"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JoinLobby } from "@/actions/JoinLobby";

export default function JoinLobbyDialog() {

  const router = useRouter();

  const [code, setCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleJoin() {

    if (!code.trim())
      return;

    try {

      setLoading(true);

      const data =
        await JoinLobby(code);

      router.push(
        `/lobby/${data.lobbyId}`
      );

    } catch (error) {

      console.error(
        "Join failed:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-6">

      <h2 className="text-white text-2xl font-bold">

        Join Quiz Room 🎮

      </h2>

      <p className="text-neutral-400 mt-2">

        Enter room code shared by host

      </p>

      <input
        value={code}
        onChange={(e)=>
          setCode(e.target.value)
        }
        placeholder="Enter room code"
        className="w-full mt-6 p-4 rounded-xl bg-black border border-white/10 text-white"
      />

      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full mt-5 bg-orange-500 hover:bg-orange-600 py-4 rounded-xl text-white font-semibold transition"
      >

        {
          loading
          ? "Joining..."
          : "Join Lobby"
        }

      </button>

    </div>

  );

}