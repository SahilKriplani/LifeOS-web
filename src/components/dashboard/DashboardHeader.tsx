"use client";

import { motion } from "framer-motion";
import { getGreeting, formatDate } from "@/lib/utils";
import { Flame } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────
interface DashboardHeaderProps {
  name: string;
  streak: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardHeader({
  name,
  streak,
}: DashboardHeaderProps) {
  const greeting = getGreeting();
  const today = formatDate(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-start justify-between flex-wrap gap-4"
    >
      {/* ── Left — Greeting ── */}
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {greeting}, {name} 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          {today}
        </motion.p>
      </div>

      {/* ── Right — Streak badge ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          delay: 0.3,
          type: "spring",
          stiffness: 200,
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "var(--muted)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame size={16} className="text-orange-400" />
        </motion.div>
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {streak} day streak
        </span>
      </motion.div>
    </motion.div>
  );
}
