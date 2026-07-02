"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background: "#0a0a0a",
        position: "relative",
      }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SideBar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            zIndex: 999,
            display: "flex",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 220,
              height: "100vh",
              background: "#0a0a0a",
              overflowY: "auto",
            }}
          >
            <SideBar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        }}
      >
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowX: "hidden",
            padding: "1.5rem",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
