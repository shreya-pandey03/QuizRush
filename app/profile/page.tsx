"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Gamepad2,
  Star,
  Award,
  BarChart2,
  Trophy,
  Clock,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    accuracy: 0,
    winRate: 0,
  });

  const [historyCount, setHistoryCount] = useState(0);
  const [achievementCount, setAchievementCount] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.email) return;
      const res = await fetch(
        `/api/user-stats?userId=${encodeURIComponent(session.user.email!)}`,
      );
      const data = await res.json();
      setStats({
        gamesPlayed: data.gamesPlayed ?? 0,
        totalScore: data.totalScore ?? 0,
        accuracy: data.accuracy ?? 0,
        winRate: data.winRate ?? 0,
      });
      setHistoryCount(data.historyCount ?? 0);
      const achievementsRes = await fetch(
        `/api/achievements?userId=${encodeURIComponent(session.user.email!)}`,
      );

      const achievementsData = await achievementsRes.json();

      setAchievementCount(achievementsData.length);
    }
    loadProfile();
  }, [session]);

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 220,
              height: "100vh",
              background: "#0a0a0a",
            }}
          >
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        className="relative min-h-screen overflow-x-hidden p-8"
        style={{ background: "#0a0a0a", color: "#f5f0e8" }}
      >
        {/* ── Grid ── */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(234,120,30,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(234,120,30,.055) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            zIndex: 0,
          }}
        />
        {/* ── Top glow ── */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(234,120,30,.13) 0%, transparent 65%)",
            zIndex: 0,
          }}
        />
        {/* ── Bottom-right glow ── */}
        <div
          className="fixed bottom-0 right-0 pointer-events-none"
          style={{
            width: 420,
            height: 420,
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
            top: 0,
            background:
              "linear-gradient(90deg, transparent, rgba(234,120,30,.25), transparent)",
            animation: "qrScan 6s linear infinite",
            zIndex: 1,
          }}
        />
        {/* ── Orbs ── */}
        <div
          className="fixed pointer-events-none"
          style={{
            top: "18%",
            left: "4%",
            width: 76,
            height: 76,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
            boxShadow:
              "0 0 0 1px rgba(234,120,30,.3), 0 0 34px rgba(234,120,30,.18)",
            animation: "floatA 8s ease-in-out infinite",
            opacity: 0.42,
            zIndex: 0,
          }}
        />
        <div
          className="fixed pointer-events-none"
          style={{
            top: "58%",
            right: "4%",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
            animation: "floatB 10s ease-in-out infinite",
            opacity: 0.38,
            zIndex: 0,
          }}
        />
        <div
          className="fixed pointer-events-none"
          style={{
            bottom: "18%",
            left: "8%",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#1a0a03",
            border: "1px solid rgba(234,120,30,.4)",
            animation: "floatC 6s ease-in-out infinite",
            opacity: 0.5,
            zIndex: 0,
          }}
        />
        <div
          className="fixed pointer-events-none"
          style={{
            top: "10%",
            right: "12%",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#1a0a03",
            border: "1px solid rgba(234,120,30,.3)",
            animation: "floatA 7s ease-in-out infinite",
            opacity: 0.45,
            zIndex: 0,
          }}
        />
        {/* ── Rings ── */}
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
            right: "3%",
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "0.5px solid rgba(234,120,30,.11)",
            animation: "spinRing 16s linear infinite reverse",
            zIndex: 0,
          }}
        />

        {/* ══ CONTENT ══ */}
        <div className="relative mx-auto" style={{ zIndex: 10, maxWidth: 860 }}>
          {/* ── Header ── */}
          <div
            className="flex items-start justify-between flex-wrap gap-4 pb-6 mb-8"
            style={{ borderBottom: "0.5px solid rgba(234,120,30,.15)" }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#ea781e" }}>⚡</span>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "#ea781e",
                  }}
                >
                  QuizRush — Player Profile
                </span>
              </div>
              <h1
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.4rem)",
                  fontWeight: 400,
                  fontFamily: "Georgia, serif",
                  color: "#f5f0e8",
                  lineHeight: 1.1,
                }}
              >
                Your Quiz{" "}
                <span style={{ color: "#ea781e", fontStyle: "italic" }}>
                  Journey
                </span>
              </h1>
              <p
                style={{
                  color: "rgba(245,240,232,.45)",
                  marginTop: 8,
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                }}
              >
                Track your progress, achievements and performance across all
                quizzes.
              </p>
            </div>

            {/* Player avatar card */}
            {session?.user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: "rgba(234,120,30,.06)",
                  border: "0.5px solid rgba(234,120,30,.2)",
                  alignSelf: "flex-start",
                }}
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="avatar"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "1.5px solid rgba(234,120,30,.4)",
                      boxShadow: "0 0 12px rgba(234,120,30,.2)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "#fff",
                      fontWeight: 600,
                      boxShadow: "0 0 12px rgba(234,120,30,.2)",
                    }}
                  >
                    {session.user.name?.charAt(0).toUpperCase() ?? "P"}
                  </div>
                )}
                <div>
                  <p
                    style={{
                      color: "#f5f0e8",
                      fontSize: 14,
                      fontFamily: "Georgia, serif",
                      lineHeight: 1.2,
                      marginBottom: 2,
                    }}
                  >
                    {session.user.name}
                  </p>
                  <p style={{ color: "rgba(245,240,232,.35)", fontSize: 11 }}>
                    {session.user.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Stat cards ── */}
          <div
            className="grid md:grid-cols-3 gap-4"
            style={{ marginBottom: 20 }}
          >
            {[
              {
                title: "Games Played",
                value: stats.gamesPlayed,
                icon: <Gamepad2 size={18} />,
                color: "#ea781e",
                bg: "rgba(234,120,30,.1)",
                border: "rgba(234,120,30,.25)",
              },
              {
                title: "Total Score",
                value: stats.totalScore,
                icon: <Star size={18} />,
                color: "#FAC775",
                bg: "rgba(250,199,117,.1)",
                border: "rgba(250,199,117,.25)",
              },
              {
                title: "Achievements",
                value: achievementCount,
                icon: <Award size={18} />,
                color: "#97C459",
                bg: "rgba(59,109,17,.12)",
                border: "rgba(59,109,17,.28)",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  borderRadius: 14,
                  background: "rgba(13,13,13,.88)",
                  backdropFilter: "blur(20px)",
                  border: "0.5px solid rgba(234,120,30,.15)",
                  padding: "1.5rem",
                  transition: "border-color .2s, background .2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    card.border;
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(234,120,30,.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(234,120,30,.15)";
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(13,13,13,.88)";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 9,
                    background: card.bg,
                    border: `0.5px solid ${card.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                    marginBottom: 14,
                  }}
                >
                  {card.icon}
                </div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,.4)",
                    marginBottom: 6,
                  }}
                >
                  {card.title}
                </p>
                <h2
                  style={{
                    fontSize: "clamp(2rem, 5vw, 2.6rem)",
                    fontWeight: 400,
                    fontFamily: "Georgia, serif",
                    color: card.color,
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </h2>
              </div>
            ))}
          </div>

          {/* ── Navigation cards ── */}
          <div
            style={{
              fontSize: 10,
              letterSpacing: ".13em",
              textTransform: "uppercase",
              color: "#ea781e",
              marginBottom: 14,
            }}
          >
            Sections
          </div>
          <div
            className="grid md:grid-cols-3 gap-4"
            style={{ marginBottom: 32 }}
          >
            {[
              {
                label: "Statistics",
                subtitle: "Accuracy, win rate and overall performance.",
                icon: <BarChart2 size={22} />,
                href: "/profile/stats",
                color: "#ea781e",
                bg: "rgba(234,120,30,.1)",
                border: "rgba(234,120,30,.25)",
              },
              {
                label: "Achievements",
                subtitle: "Every badge and milestone you've unlocked.",
                icon: <Trophy size={22} />,
                href: "/profile/achievements",
                color: "#FAC775",
                bg: "rgba(250,199,117,.1)",
                border: "rgba(250,199,117,.25)",
              },
              {
                label: `Match History (${historyCount})`,
                subtitle: "Review previous games and final scores.",
                icon: <Clock size={22} />,
                href: "/profile/history",
                color: "#97C459",
                bg: "rgba(59,109,17,.12)",
                border: "rgba(59,109,17,.28)",
              },
            ].map((card) => (
              <button
                key={card.label}
                onClick={() => router.push(card.href)}
                style={{
                  textAlign: "left",
                  borderRadius: 14,
                  background: "rgba(13,13,13,.88)",
                  backdropFilter: "blur(20px)",
                  border: "0.5px solid rgba(234,120,30,.15)",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "border-color .2s, background .2s, transform .2s",
                  color: "#f5f0e8",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    card.border;
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(234,120,30,.05)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(234,120,30,.15)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(13,13,13,.88)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: card.bg,
                    border: `0.5px solid ${card.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                    marginBottom: 16,
                  }}
                >
                  {card.icon}
                </div>

                {/* Text */}
                <h3
                  style={{
                    fontSize: 16,
                    fontFamily: "Georgia, serif",
                    color: "#f5f0e8",
                    marginBottom: 6,
                  }}
                >
                  {card.label}
                </h3>
                <p
                  style={{
                    color: "rgba(245,240,232,.45)",
                    fontSize: 13,
                    fontFamily: "Georgia, serif",
                    lineHeight: 1.55,
                    marginBottom: 16,
                  }}
                >
                  {card.subtitle}
                </p>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: card.color,
                    letterSpacing: ".06em",
                  }}
                >
                  <span>Open section</span>
                  <ChevronRight size={13} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Keyframes ── */}
        <style>{`
        @keyframes qrScan    { 0%{top:-2%} 100%{top:102%} }
        @keyframes qrBlink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatA    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatB    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes floatC    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spinRing  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
      </main>
    </>
  );
}
