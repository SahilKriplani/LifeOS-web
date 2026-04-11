"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DSAHeader from "@/components/dsa/DSAHeader";
import DSAStatsRow from "@/components/dsa/DSAStatsRow";
import DSALogList from "@/components/dsa/DSALogList";
import DSALogModal from "@/components/dsa/DSALogModal";
import GlassCard from "@/components/shared/GlassCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DSALog, DSAStats, CreateDSALogPayload } from "@/types";
import toast from "react-hot-toast";

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockLogs: DSALog[] = [
  {
    id: 1,
    userId: 1,
    problemName: "Two Sum",
    platform: "leetcode",
    difficulty: "easy",
    topic: "Arrays",
    solvedAt: "2025-04-01",
  },
  {
    id: 2,
    userId: 1,
    problemName: "Best Time to Buy Stock",
    platform: "leetcode",
    difficulty: "easy",
    topic: "Arrays",
    solvedAt: "2025-04-02",
  },
  {
    id: 3,
    userId: 1,
    problemName: "Longest Substring Without Repeating",
    platform: "leetcode",
    difficulty: "medium",
    topic: "Strings",
    solvedAt: "2025-04-03",
  },
  {
    id: 4,
    userId: 1,
    problemName: "Merge Intervals",
    platform: "leetcode",
    difficulty: "medium",
    topic: "Arrays",
    solvedAt: "2025-04-04",
  },
  {
    id: 5,
    userId: 1,
    problemName: "Word Ladder",
    platform: "leetcode",
    difficulty: "hard",
    topic: "Graphs",
    solvedAt: "2025-04-05",
  },
];

const mockChartData = [
  { date: "Apr 1", solved: 2 },
  { date: "Apr 2", solved: 5 },
  { date: "Apr 3", solved: 9 },
  { date: "Apr 4", solved: 12 },
  { date: "Apr 5", solved: 18 },
  { date: "Apr 6", solved: 22 },
  { date: "Apr 7", solved: 27 },
];

// ─── Filter type ──────────────────────────────────────────────────────────────
type FilterType = "all" | "easy" | "medium" | "hard";

const filters: { label: string; value: FilterType; color: string }[] = [
  { label: "All", value: "all", color: "var(--primary)" },
  { label: "Easy", value: "easy", color: "#10b981" },
  { label: "Medium", value: "medium", color: "#f59e0b" },
  { label: "Hard", value: "hard", color: "#f43f5e" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function DSAPage() {
  const [logs, setLogs] = useState<DSALog[]>(mockLogs);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const stats: DSAStats = {
    total: logs.length,
    easy: logs.filter((l) => l.difficulty === "easy").length,
    medium: logs.filter((l) => l.difficulty === "medium").length,
    hard: logs.filter((l) => l.difficulty === "hard").length,
    byTopic: logs.reduce(
      (acc, l) => {
        acc[l.topic] = (acc[l.topic] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  // ─── Filtered logs ───────────────────────────────────────────────────────────
  const filteredLogs =
    filter === "all" ? logs : logs.filter((l) => l.difficulty === filter);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleLog = (payload: CreateDSALogPayload) => {
    const newLog: DSALog = {
      id: Date.now(),
      userId: 1,
      ...payload,
    };
    setLogs((prev) => [newLog, ...prev]);
    toast.success("Problem logged! 🎉");
  };

  const handleDelete = (id: number) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    toast.success("Log deleted");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <DSAHeader total={stats.total} onLogProblem={() => setModalOpen(true)} />

      {/* Stats row */}
      <DSAStatsRow stats={stats} />

      {/* Progress chart */}
      <GlassCard padding="md" className="flex flex-col gap-4">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Solving Streak
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            Cumulative problems solved
          </p>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--glass-border)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="solved"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={{ fill: "var(--primary)", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Log list */}
      <GlassCard padding="md" className="flex flex-col gap-5">
        {/* Filter tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Problem Logs
          </h3>
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{ background: "var(--muted)" }}
          >
            {filters.map((f) => {
              const count =
                f.value === "all"
                  ? logs.length
                  : logs.filter((l) => l.difficulty === f.value).length;
              return (
                <motion.button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={
                    filter === f.value
                      ? { background: f.color, color: "#fff" }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  {f.label} {count}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <DSALogList logs={filteredLogs} onDelete={handleDelete} />
      </GlassCard>

      {/* Modal */}
      <DSALogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleLog}
      />
    </div>
  );
}
