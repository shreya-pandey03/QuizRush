"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, X } from "lucide-react";

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;

  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();

  return (
    <nav
      style={{
        width: "100%",
        boxSizing: "border-box",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        padding: "0 1rem",

        height: 58,

        background: "rgba(10,10,10,.92)",

        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",

        borderBottom: "0.5px solid rgba(234,120,30,.15)",

        position: "sticky",
        top: 0,

        zIndex: 50,

        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* TOP GLOW */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(234,120,30,.35), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR TOGGLE */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden"
          style={{
            background: "transparent",
            border: "none",
            color: "#f5f0e8",
            cursor: "pointer",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,
          }}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* LOGO */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            minWidth: 0,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#ea781e",
              display: "inline-block",
              animation: "nbBlink 1.5s ease-in-out infinite",
              flexShrink: 0,
            }}
          />

          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(14px, 3vw, 17px)",
              color: "#f5f0e8",
              fontWeight: 400,
              letterSpacing: ".01em",

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Quiz
            <span
              style={{
                color: "#ea781e",
                fontStyle: "italic",
              }}
            >
              Rush
            </span>
          </span>
        </Link>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {session?.user && (
          <button
            onClick={() =>
              signOut({
                callbackUrl: "/signup",
              })
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,

              padding: "7px 12px",

              borderRadius: 8,

              background: "rgba(163,45,45,.15)",
              border: "0.5px solid rgba(163,45,45,.35)",

              color: "#F09595",

              fontSize: 13,
              fontFamily: "Georgia, serif",

              cursor: "pointer",

              transition: "background .2s, transform .15s",

              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(163,45,45,.28)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(163,45,45,.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <LogOut size={13} />
            <span className="hidden sm:block">Sign Out</span>
          </button>
        )}
      </div>

      <style>{`
    @keyframes nbBlink {
      0%,100% { opacity:1; }
      50% { opacity:.3; }
    }
  `}</style>
    </nav>
  );
}
