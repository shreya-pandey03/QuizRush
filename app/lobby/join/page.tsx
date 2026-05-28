"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinLobbyPage() {
  const [roomCode, setRoomCode] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  function joinLobby() {
    const code = roomCode.trim();
    if (!code) return;
    router.push(`/lobby/${code}`);
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
          bottom: 0, right: 0,
          width: 400, height: 400,
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
          top: "18%", left: "5%",
          width: 72, height: 72,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.3), 0 0 32px rgba(234,120,30,.18)",
          animation: "floatA 8s ease-in-out infinite",
          opacity: 0.45, zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "62%", right: "6%",
          width: 48, height: 48,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.25), 0 0 20px rgba(234,120,30,.15)",
          animation: "floatB 10s ease-in-out infinite",
          opacity: 0.4, zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "20%", left: "10%",
          width: 28, height: 28,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.4)",
          animation: "floatC 6s ease-in-out infinite",
          opacity: 0.55, zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "10%", right: "13%",
          width: 18, height: 18,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.35)",
          animation: "floatA 7s ease-in-out infinite",
          opacity: 0.5, zIndex: 0,
        }}
      />

      {/* ── Spinning orbital rings ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "6%", left: "2%",
          width: 100, height: 100,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.14)",
          animation: "spinRing 22s linear infinite",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "8%", right: "4%",
          width: 65, height: 65,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.11)",
          animation: "spinRing 16s linear infinite reverse",
          zIndex: 0,
        }}
      />

      {/* ══════════════════════════════
          CARD
      ══════════════════════════════ */}
      <div
        className="relative w-full max-w-md"
        style={{ zIndex: 10 }}
      >
        {/* Live badge */}
        <div
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(234,120,30,.1)",
              border: "0.5px solid rgba(234,120,30,.35)",
              borderRadius: 100, padding: "5px 14px",
              fontSize: 10, letterSpacing: ".14em",
              textTransform: "uppercase", color: "#ea781e",
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#ea781e", display: "inline-block",
                animation: "qrBlink 1s step-end infinite",
              }}
            />
            QuizRush — Join a room
          </div>
        </div>

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
          {/* Icon */}
          <div
            style={{
              width: 56, height: 56, borderRadius: 14,
              background:
                "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 0 1px rgba(234,120,30,.4), 0 10px 28px rgba(234,120,30,.22)",
              fontSize: 24,
              marginBottom: "1.25rem",
              animation: "floatA 6s ease-in-out infinite",
            }}
          >
            🎮
          </div>

          <h1
            style={{
              fontSize: 26, fontWeight: 400,
              fontFamily: "Georgia, serif",
              color: "#f5f0e8", lineHeight: 1.15,
            }}
          >
            Join Quiz{" "}
            <span style={{ color: "#ea781e", fontStyle: "italic" }}>Room</span>
          </h1>

          <p
            style={{
              color: "rgba(245,240,232,.45)",
              fontSize: 14, marginTop: 8,
              fontFamily: "Georgia, serif",
              lineHeight: 1.6,
            }}
          >
            Enter the room code shared by the host to jump in.
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
              fontSize: 10, letterSpacing: ".13em",
              textTransform: "uppercase", color: "#ea781e",
              display: "block", marginBottom: 8,
            }}
          >
            Room code
          </label>
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && joinLobby()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. QUIZ-4829"
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
              letterSpacing: ".05em",
              boxShadow: focused
                ? "0 0 0 3px rgba(234,120,30,.08)"
                : "none",
              transition: "border-color .2s, box-shadow .2s",
            }}
          />

          {/* Join button */}
          <button
            onClick={joinLobby}
            disabled={!roomCode.trim()}
            style={{
              width: "100%",
              marginTop: 14,
              padding: "13px 0",
              borderRadius: 10,
              background: roomCode.trim() ? "#ea781e" : "rgba(234,120,30,.25)",
              border: "none",
              color: roomCode.trim() ? "#fff" : "rgba(245,240,232,.35)",
              fontSize: 15,
              fontFamily: "Georgia, serif",
              cursor: roomCode.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: roomCode.trim()
                ? "0 8px 24px rgba(234,120,30,.25)"
                : "none",
              transition: "background .2s, box-shadow .2s, transform .15s",
            }}
            onMouseEnter={(e) => {
              if (!roomCode.trim()) return;
              (e.currentTarget as HTMLButtonElement).style.background =
                "#d46a15";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              if (!roomCode.trim()) return;
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ea781e";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            Join Room
            <span style={{ fontSize: 16 }}>→</span>
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "rgba(245,240,232,.22)",
              marginTop: 14,
            }}
          >
            Ask the host to share the room code with you
          </p>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes qrScan {
          0%  { top: -2% }
          100%{ top: 102% }
        }
        @keyframes qrBlink {
          0%,100%{ opacity: 1 }
          50%    { opacity: 0 }
        }
        @keyframes floatA {
          0%,100%{ transform: translateY(0px) }
          50%    { transform: translateY(-14px) }
        }
        @keyframes floatB {
          0%,100%{ transform: translateY(0px) }
          50%    { transform: translateY(-9px) }
        }
        @keyframes floatC {
          0%,100%{ transform: translateY(0px) }
          50%    { transform: translateY(-6px) }
        }
        @keyframes spinRing {
          0%  { transform: rotate(0deg) }
          100%{ transform: rotate(360deg) }
        }
      `}</style>
    </main>
  );
}