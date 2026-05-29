"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Home, Users, User, Trophy, LogOut } from "lucide-react";

const NAV_LINKS = [
  { href: "/home",        label: "Home",        icon: <Home size={15} /> },
  { href: "/lobby",       label: "Lobby",       icon: <Users size={15} /> },
  { href: "/profile",     label: "Profile",     icon: <User size={15} /> },
  { href: "/leaderboard", label: "Leaderboard", icon: <Trophy size={15} /> },
];

export default function SideBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#0a0a0a",
        borderRight: "0.5px solid rgba(234,120,30,.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.5rem 1.25rem",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* ── Subtle inner glow ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 180,
          background:
            "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(234,120,30,.09) 0%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── TOP ── */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 7,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#ea781e", display: "inline-block",
                animation: "sbBlink 1.5s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 20, letterSpacing: ".15em",
                textTransform: "uppercase", color: "#ea781e",
              }}
            >
              QuizRush
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 18, fontWeight: 400,
              color: "#f5f0e8", lineHeight: 1.2,
            }}
          >
          </h1>
        </div>

        {/* Divider */}
        <div style={{ height: "0.5px", background: "rgba(234,120,30,.15)", marginBottom: "1.5rem" }} />

        {/* Nav links */}
        <nav>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active = pathname === href || pathname?.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px",
                      borderRadius: 9,
                      background: active ? "rgba(234,120,30,.12)" : "transparent",
                      border: active
                        ? "0.5px solid rgba(234,120,30,.3)"
                        : "0.5px solid transparent",
                      color: active ? "#f5f0e8" : "rgba(245,240,232,.45)",
                      fontSize: 14,
                      fontFamily: "Georgia, serif",
                      textDecoration: "none",
                      transition: "background .2s, color .2s, border-color .2s",
                    }}
                    onMouseEnter={(e) => {
                      if (active) return;
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(234,120,30,.06)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#f5f0e8";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(234,120,30,.15)";
                    }}
                    onMouseLeave={(e) => {
                      if (active) return;
                      (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,.45)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
                    }}
                  >
                    {/* Icon */}
                    <span style={{ color: active ? "#ea781e" : "rgba(245,240,232,.3)", transition: "color .2s", display: "flex" }}>
                      {icon}
                    </span>
                    {label}

                    {/* Active indicator dot */}
                    {active && (
                      <span
                        style={{
                          marginLeft: "auto", width: 5, height: 5,
                          borderRadius: "50%", background: "#ea781e",
                          animation: "sbBlink 1.5s ease-in-out infinite",
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* ── BOTTOM ── */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Divider */}
        <div style={{ height: "0.5px", background: "rgba(234,120,30,.12)", marginBottom: "1.25rem" }} />

        {/* User info */}
        {session?.user && (
          <div
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(234,120,30,.05)",
              border: "0.5px solid rgba(234,120,30,.15)",
              marginBottom: 10,
            }}
          >
            {/* Avatar */}
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="avatar"
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: "1px solid rgba(234,120,30,.35)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#fff", fontWeight: 600, flexShrink: 0,
                }}
              >
                {session.user.name?.charAt(0).toUpperCase() ?? "P"}
              </div>
            )}
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  color: "#f5f0e8", fontSize: 13,
                  fontFamily: "Georgia, serif",
                  whiteSpace: "nowrap", overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {session.user.name}
              </p>
              <p
                style={{
                  color: "rgba(245,240,232,.35)", fontSize: 11,
                  whiteSpace: "nowrap", overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/signup" })}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 7,
            padding: "10px 0",
            borderRadius: 9,
            background: "rgba(163,45,45,.15)",
            border: "0.5px solid rgba(163,45,45,.35)",
            color: "#F09595",
            fontSize: 13,
            fontFamily: "Georgia, serif",
            cursor: "pointer",
            transition: "background .2s, transform .15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,45,45,.28)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,45,45,.15)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes sbBlink {
          0%,100%{ opacity: 1 }
          50%    { opacity: 0.3 }
        }
      `}</style>
    </div>
  );
}