"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--secondary)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <motion.main
        className="relative z-10 min-h-screen"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
        <div className="mx-auto max-w-screen-2xl px-4 md:px-6 lg:px-8 pb-8 pt-4 md:pt-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
