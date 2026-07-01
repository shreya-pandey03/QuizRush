"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Brain, Trophy, Users, ArrowRight, LogOut } from "lucide-react";

export default function SignUpPage() {
  const { data: session } = useSession();

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden px-4">
      {/* ── Grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(234,120,30,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,120,30,.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Radial glow top ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(234,120,30,.16) 0%, transparent 68%)",
        }}
      />

      {/* ── Bottom-right soft glow ── */}
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Scanline sweep ── */}
      <div
        className="absolute left-0 right-0 h-0.5 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(234,120,30,.28), transparent)",
          animation: "scanline 6s linear infinite",
        }}
      />

      {/* ── 3-D floating orbs ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "18%",
          left: "8%",
          width: 90,
          height: 90,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.3), 0 0 40px rgba(234,120,30,.2)",
          animation: "floatA 7s ease-in-out infinite",
          opacity: 0.55,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "60%",
          right: "7%",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
          boxShadow:
            "0 0 0 1px rgba(234,120,30,.25), 0 0 24px rgba(234,120,30,.18)",
          animation: "floatB 9s ease-in-out infinite",
          opacity: 0.45,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "78%",
          left: "15%",
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.45)",
          animation: "floatC 5s ease-in-out infinite",
          opacity: 0.6,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "12%",
          right: "14%",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#1a0a03",
          border: "1px solid rgba(234,120,30,.35)",
          animation: "floatA 8s ease-in-out infinite",
          opacity: 0.5,
        }}
      />

      {/* ── Orbiting ring (decorative) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "14%",
          left: "5%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.18)",
          animation: "spinRing 20s linear infinite",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "12%",
          right: "5%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "0.5px solid rgba(234,120,30,.14)",
          animation: "spinRing 14s linear infinite reverse",
        }}
      />

      {/* ── Live badge top-center ── */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
        style={{
          background: "rgba(234,120,30,.12)",
          border: "0.5px solid rgba(234,120,30,.4)",
          borderRadius: 100,
          padding: "5px 16px",
          fontSize: 10,
          letterSpacing: ".15em",
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
            animation: "blink 1s step-end infinite",
          }}
        />
        2,400+ players live
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-md">
        <div
          style={{
            borderRadius: 24,
            background: "rgba(13,13,13,.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "0.5px solid rgba(234,120,30,.2)",
            padding: "2.25rem 2rem",
            boxShadow:
              "0 0 0 0.5px rgba(234,120,30,.1), 0 32px 80px rgba(0,0,0,.6)",
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background:
                  "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 0 0 1px rgba(234,120,30,.4), 0 12px 32px rgba(234,120,30,.25)",
                animation: "floatA 6s ease-in-out infinite",
              }}
            >
              <Brain className="w-7 h-7 text-white" />
            </div>
          </div>

          {session ? (
            /* ── Logged-in state ── */
            <div className="flex flex-col items-center">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="profile"
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    border: "2.5px solid #ea781e",
                    boxShadow: "0 0 20px rgba(234,120,30,.3)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    border: "2.5px solid #ea781e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    background: "rgba(234,120,30,.08)",
                  }}
                >
                  👤
                </div>
              )}

              <h1
                style={{
                  color: "#f5f0e8",
                  fontSize: 22,
                  fontWeight: 500,
                  marginTop: 20,
                  fontFamily: "Georgia, serif",
                }}
              >
                Welcome back
              </h1>

              <p
                style={{
                  color: "#ea781e",
                  marginTop: 6,
                  fontSize: 15,
                  fontFamily: "Georgia, serif",
                }}
              >
                {session.user?.name}
              </p>
              <p
                style={{
                  color: "rgba(245,240,232,.45)",
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                {session.user?.email}
              </p>

              <button
                onClick={() => signOut({ callbackUrl: "/signup" })}
                style={{
                  marginTop: 24,
                  padding: "11px 24px",
                  borderRadius: 10,
                  background: "rgba(163,45,45,.2)",
                  border: "0.5px solid #A32D2D",
                  color: "#F09595",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                  transition: "background .2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(163,45,45,.35)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(163,45,45,.2)")
                }
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            /* ── Sign-up state ── */
            <>
              {/* Brand name */}
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "Georgia, serif",
                  fontSize: 13,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#ea781e",
                  marginBottom: 10,
                }}
              >
                QuizRush
              </div>

              <h1
                style={{
                  textAlign: "center",
                  color: "#f5f0e8",
                  fontSize: 26,
                  fontWeight: 400,
                  fontFamily: "Georgia, serif",
                  lineHeight: 1.2,
                }}
              >
                Multiplayer Quiz Game
              </h1>

              <p
                style={{
                  textAlign: "center",
                  color: "rgba(245,240,232,.45)",
                  marginTop: 10,
                  fontSize: 14,
                  lineHeight: 1.7,
                  fontFamily: "Georgia, serif",
                }}
              >
                Join rooms, play real-time quizzes and compete with players
                worldwide
              </p>

              {/* Feature pills */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  marginTop: 24,
                }}
              >
                {[
                  {
                    icon: (
                      <Users className="w-5 h-5" style={{ color: "#ea781e" }} />
                    ),
                    label: "Rooms",
                  },
                  {
                    icon: (
                      <Brain className="w-5 h-5" style={{ color: "#ea781e" }} />
                    ),
                    label: "Quiz",
                  },
                  {
                    icon: (
                      <Trophy
                        className="w-5 h-5"
                        style={{ color: "#ea781e" }}
                      />
                    ),
                    label: "Ranking",
                  },
                ].map((f) => (
                  <div
                    key={f.label}
                    style={{
                      borderRadius: 12,
                      padding: "14px 8px",
                      background: "rgba(234,120,30,.06)",
                      border: "0.5px solid rgba(234,120,30,.2)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      transition: "background .2s",
                    }}
                  >
                    {f.icon}
                    <span
                      style={{
                        color: "rgba(245,240,232,.6)",
                        fontSize: 12,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider with stats */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "20px 0",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "0.5px",
                    background: "rgba(234,120,30,.15)",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(245,240,232,.3)",
                    letterSpacing: ".08em",
                  }}
                >
                  48K+ players · 312 rooms live
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "0.5px",
                    background: "rgba(234,120,30,.15)",
                  }}
                />
              </div>

              {/* Google sign-in button */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/home" })}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 10,
                  background: "#ea781e",
                  border: "none",
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "Georgia, serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(234,120,30,.25)",
                  transition: "background .2s, transform .15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#d46a15";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#ea781e";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                {/* Google logo */}
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path
                    fill="#fff"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  />
                </svg>
                Continue with Google
                <ArrowRight size={16} />
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: "rgba(245,240,232,.25)",
                  marginTop: 14,
                  lineHeight: 1.6,
                }}
              >
                By continuing you agree to our Terms & Privacy Policy
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes scanline {
          0%  { top: -2% }
          100%{ top: 102% }
        }
        @keyframes blink {
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
