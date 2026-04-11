"use client";

import { Badge } from "@/components/ui/badge";
import type { DSALog } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, Trash2 } from "lucide-react";

// ─── Difficulty colors ────────────────────────────────────────────────────────
const difficultyConfig = {
  easy: { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  hard: { color: "#f43f5e", bg: "rgba(244,63,94,0.1)" },
};

const platformConfig: Record<string, string> = {
  leetcode: "#f59e0b",
  codeforces: "#3b82f6",
  gfg: "#10b981",
  other: "#8b5cf6",
};

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-3"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: "var(--muted)" }}
      >
        <Code2 size={22} style={{ color: "var(--muted-foreground)" }} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          No problems logged yet
        </p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Start logging your DSA progress
        </p>
      </div>
    </motion.div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface DSALogListProps {
  logs: DSALog[];
  onDelete: (id: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DSALogList({ logs, onDelete }: DSALogListProps) {
  if (logs.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {logs.map((log, i) => {
          const diff = difficultyConfig[log.difficulty];
          return (
            <motion.div
              key={log.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              whileHover={{ scale: 1.005 }}
              className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
              }}
            >
              {/* Difficulty dot */}
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: diff.color }}
              />

              {/* Problem name */}
              <span
                className="flex-1 text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {log.problemName}
              </span>

              {/* Topic */}
              <span
                className="text-xs hidden md:block"
                style={{ color: "var(--muted-foreground)" }}
              >
                {log.topic}
              </span>

              {/* Platform badge */}
              <Badge
                className="text-xs font-medium capitalize border-0 hidden sm:flex"
                style={{
                  background: `${platformConfig[log.platform]}18`,
                  color: platformConfig[log.platform],
                }}
              >
                {log.platform}
              </Badge>

              {/* Difficulty badge */}
              <Badge
                className="text-xs font-medium capitalize border-0"
                style={{
                  background: diff.bg,
                  color: diff.color,
                }}
              >
                {log.difficulty}
              </Badge>

              {/* Date */}
              <span
                className="text-xs hidden lg:block shrink-0"
                style={{ color: "var(--muted-foreground)" }}
              >
                {log.solvedAt}
              </span>

              {/* Delete button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(log.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                style={{
                  background: "rgba(244,63,94,0.1)",
                  color: "#f43f5e",
                }}
              >
                <Trash2 size={12} />
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
