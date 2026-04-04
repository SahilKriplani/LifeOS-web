"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardShellProps {
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Background gradient blobs — gives depth to glassmorphism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top left blob */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        {/* Bottom right blob */}
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--secondary)" }}
        />
        {/* Center accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <motion.main
        animate={{
          marginLeft: sidebarCollapsed ? 68 : 240,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10 min-h-screen"
        style={{
          paddingTop: "var(--navbar-height)",
        }}
      >
        <div className="p-6">{children}</div>
      </motion.main>
    </div>
  );
}
