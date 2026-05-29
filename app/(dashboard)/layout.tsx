"use client";

import {
  useState,
} from "react";

import Navbar from "@/components/Navbar";

import SideBar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar
        sidebarOpen={
          sidebarOpen
        }
        setSidebarOpen={
          setSidebarOpen
        }
      />

      <div className="flex">

        {sidebarOpen && (
          <SideBar />
        )}

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}