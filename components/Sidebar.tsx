"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Home, Users, User, Trophy, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const NAV_LINKS = [
  { href: "/home", label: "Home", icon: <Home size={15} /> },
  { href: "/lobby", label: "Lobby", icon: <Users size={15} /> },
  { href: "/profile", label: "Profile", icon: <User size={15} /> },
  { href: "/leaderboard", label: "Leaderboard", icon: <Trophy size={15} /> },
];

export default function SideBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div
      style={{
        width: "220px",
        minWidth: "220px",
        maxWidth: "220px",
        height: "100vh",
        background: "#0a0a0a",
        borderRight: "0.5px solid rgba(234,120,30,.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1rem",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* ── Subtle inner glow ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 180,
          background:
            "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(234,120,30,.09) 0%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* TOP */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 4,
              overflow: "hidden",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                minWidth: 7,
                borderRadius: "50%",
                background: "#ea781e",
                display: "inline-block",
                animation: "sbBlink 1.5s ease-in-out infinite",
              }}
            />

            <span
              style={{
                fontSize: "clamp(14px, 2vw, 20px)",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "#ea781e",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              QuizRush
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "0.5px",
            background: "rgba(234,120,30,.15)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Navigation */}
        <nav>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active =
                pathname === href || pathname?.startsWith(href + "/");

              return (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px",
                      borderRadius: 9,

                      background: active
                        ? "rgba(234,120,30,.12)"
                        : "transparent",

                      border: active
                        ? "0.5px solid rgba(234,120,30,.3)"
                        : "0.5px solid transparent",

                      color: active ? "#f5f0e8" : "rgba(245,240,232,.45)",

                      fontSize: 13,
                      fontFamily: "Georgia, serif",
                      textDecoration: "none",

                      overflow: "hidden",

                      transition: "background .2s, color .2s, border-color .2s",
                    }}
                  >
                    <span
                      style={{
                        color: active ? "#ea781e" : "rgba(245,240,232,.3)",
                        display: "flex",
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </span>

                    <span
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {label}
                    </span>

                    {active && (
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#ea781e",
                          flexShrink: 0,
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

      {/* Bottom */}
      {session?.user && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* User Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(234,120,30,.05)",
              border: "0.5px solid rgba(234,120,30,.15)",
              overflow: "hidden",
            }}
          >
            <Avatar
              style={{
                width: 30,
                height: 30,
                border: "1px solid rgba(234,120,30,.35)",
                flexShrink: 0,
              }}
            >
              <AvatarImage src={session.user.image ?? undefined} />

              <AvatarFallback
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 55%, #7a3a0a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {session.user.name?.charAt(0).toUpperCase() ?? "P"}
              </AvatarFallback>
            </Avatar>

            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <p
                style={{
                  color: "#f5f0e8",
                  fontSize: 13,
                  fontFamily: "Georgia, serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {session.user.name}
              </p>

              <p
                style={{
                  color: "rgba(245,240,232,.35)",
                  fontSize: 11,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Sign Out */}
          <div
            style={{
              borderRadius: 10,
              background: "rgba(163,45,45,.08)",
              border: "0.5px solid rgba(163,45,45,.25)",
              padding: 4,
            }}
          >
            <button
              onClick={() => signOut({ callbackUrl: "/signup" })}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "9px 0",
                borderRadius: 8,

                background: "rgba(163,45,45,.15)",
                border: "0.5px solid rgba(163,45,45,.35)",

                color: "#F09595",
                fontSize: 12,
                fontFamily: "Georgia, serif",

                cursor: "pointer",
                whiteSpace: "nowrap",

                transition: "all .2s ease",
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      <style>{`
    @keyframes sbBlink {
      0%,100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `}</style>
    </div>
  );
}
