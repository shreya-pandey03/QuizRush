"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateLobbyPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  

  async function createLobby() {
    if (!name.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/lobby/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          hostId: session?.user?.email ?? crypto.randomUUID(),
          hostName: session?.user?.name ?? "Guest",
        }),
      });

      const data = await res.json();

      console.log("CREATE LOBBY RESPONSE:", data);

      // Support multiple possible response shapes
      const lobbyCode = data.roomCode ?? data.code ?? data.lobbyId;

      if (!lobbyCode) {
        console.error("No lobby code returned:", data);
        alert("Failed to create lobby.");
        return;
      }

      alert(`Room Code: ${lobbyCode}`);
      router.push(`/lobby/${lobbyCode}`);
    } catch (error) {
      console.error("CREATE LOBBY ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden p-6"
      style={{ background: "#0a0a0a" }}
    >
      {/* ── Grid background ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(234,120,30,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,120,30,.055) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />

      {/* ── Top radial glow ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(234,120,30,.14) 0%, transparent 68%)",
          zIndex: 0,
        }}
      />

      {/* ── Bottom-right glow ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: 0,
          right: 0,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(234,120,30,.07)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* ── Scanline ── */}
      <div
        className="fixed left-0 right-0 pointer-events-none"
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(234,120,30,.25), transparent)",
          animation: "qrScan 6s linear infinite",
          zIndex: 1,
        }}
      />

      {/* ── Floating orbs ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "18%",
          left: "5%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.3), 0 0 36px rgba(234,120,30,.18)",
          animation: "floatA 8s ease-in-out infinite",
          opacity: 0.45,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "60%",
          right: "6%",
          width: 50,
          height: 50,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.25), 0 0 20px rgba(234,120,30,.15)",
          animation: "floatB 10s ease-in-out infinite",
          opacity: 0.4,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "20%",
          left: "10%",
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.4)",
          animation: "floatC 6s ease-in-out infinite",
          opacity: 0.55,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "10%",
          right: "13%",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.35)",
          animation: "floatA 7s ease-in-out infinite",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* ── Spinning orbital rings ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "6%",
          left: "2%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.14)",
          animation: "spinRing 22s linear infinite",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "8%",
          right: "4%",
          width: 65,
          height: 65,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.11)",
          animation: "spinRing 16s linear infinite reverse",
          zIndex: 0,
        }}
      />

      {/* ══════════════════════════════
          CARD
      ══════════════════════════════ */}
      <div className="relative w-full max-w-md" style={{ zIndex: 10 }}>
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(234,120,30,.1)",
              border: "0.5px solid rgba(234,120,30,.35)",
              borderRadius: 100,
              padding: "5px 14px",
              fontSize: 10,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#ea781e",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ea781e",
                display: "inline-block",
                animation: "qrBlink 1s step-end infinite",
              }}
            />
            QuizRush — New Room
          </div>
        </div>

        {/* Main card */}
        <div
          style={{
            borderRadius: 20,
            background: "rgba(13,13,13,.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "0.5px solid rgba(234,120,30,.2)",
            padding: "2.25rem 2rem",
            boxShadow:
              "0 0 0 0.5px rgba(234,120,30,.08), 0 32px 80px rgba(0,0,0,.55)",
          }}
        >
          {/* Floating icon */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background:
                "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 0 1px rgba(234,120,30,.4), 0 10px 28px rgba(234,120,30,.22)",
              fontSize: 26,
              marginBottom: "1.5rem",
              animation: "floatA 6s ease-in-out infinite",
            }}
          >
            ⏳
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 26,
              fontWeight: 400,
              fontFamily: "Georgia, serif",
              color: "#f5f0e8",
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            Create{" "}
            <span style={{ color: "#ea781e", fontStyle: "italic" }}>Lobby</span>
          </h1>

          <p
            style={{
              color: "rgba(245,240,232,.45)",
              fontSize: 14,
              fontFamily: "Georgia, serif",
              lineHeight: 1.6,
            }}
          >
            Set up your multiplayer quiz room and invite players to battle.
          </p>

          {/* Divider */}
          <div
            style={{
              height: "0.5px",
              background: "rgba(234,120,30,.15)",
              margin: "1.5rem 0",
            }}
          />

          {/* Input */}
          <label
            style={{
              fontSize: 10,
              letterSpacing: ".13em",
              textTransform: "uppercase",
              color: "#ea781e",
              display: "block",
              marginBottom: 8,
            }}
          >
            Lobby name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createLobby()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Quiz Masters Arena"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 10,
              background: "#111",
              border: focused
                ? "0.5px solid rgba(234,120,30,.6)"
                : "0.5px solid rgba(234,120,30,.2)",
              color: "#f5f0e8",
              fontSize: 15,
              fontFamily: "Georgia, serif",
              outline: "none",
              boxShadow: focused ? "0 0 0 3px rgba(234,120,30,.08)" : "none",
              transition: "border-color .2s, box-shadow .2s",
            }}
          />

          {/* Info pills */}
          <div
            style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}
          >
            {["Up to 50 players", "Real-time scoring", "Custom questions"].map(
              (tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    borderRadius: 100,
                    background: "rgba(234,120,30,.08)",
                    border: "0.5px solid rgba(234,120,30,.2)",
                    color: "rgba(245,240,232,.5)",
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>

          {/* Create button */}
          <button
            onClick={createLobby}
            disabled={loading || !name.trim()}
            style={{
              width: "100%",
              marginTop: 20,
              padding: "14px 0",
              borderRadius: 10,
              background:
                loading || !name.trim() ? "rgba(234,120,30,.25)" : "#ea781e",
              border: "none",
              color: loading || !name.trim() ? "rgba(245,240,232,.35)" : "#fff",
              fontSize: 15,
              fontFamily: "Georgia, serif",
              cursor: loading || !name.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow:
                loading || !name.trim()
                  ? "none"
                  : "0 8px 24px rgba(234,120,30,.25)",
              transition: "background .2s, box-shadow .2s, transform .15s",
            }}
            onMouseEnter={(e) => {
              if (loading || !name.trim()) return;
              (e.currentTarget as HTMLButtonElement).style.background =
                "#d46a15";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              if (loading || !name.trim()) return;
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ea781e";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    animation: "spin 1s linear infinite",
                    display: "inline-block",
                  }}
                >
                  ⟳
                </span>
                Creating room…
              </>
            ) : (
              <>Create Lobby →</>
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "rgba(245,240,232,.22)",
              marginTop: 14,
            }}
          >
            A unique room code will be generated for your lobby
          </p>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes qrScan   { 0%{top:-2%} 100%{top:102%} }
        @keyframes qrBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatA   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatB   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes floatC   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spinRing { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes spin     { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </main>
  );
}
