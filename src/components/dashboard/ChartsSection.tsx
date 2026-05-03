"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import GlassCard from "@/components/shared/GlassCard";
import ProgressRing from "@/components/shared/ProgressRing";
import { useDSALogs, useDSAStats } from "@/hooks/useDSA";
import { useFitnessStats } from "@/hooks/useFitness";

import { useTasks } from "@/hooks/useTasks";
import { getTodayISO } from "@/lib/utils";
import type { ChartView } from "@/types";
import { useStreak } from "@/hooks/useStreaks";

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass rounded-lg px-3 py-2 text-xs flex flex-col gap-1"
      style={{ border: "1px solid var(--glass-border)" }}
    >
      <span
        className="font-semibold mb-1"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </span>
      {payload.map((entry) => (
        <span key={entry.dataKey} style={{ color: entry.color }}>
          {entry.dataKey === "dsa" ? "DSA Problems" : "Weight (kg)"}:{" "}
          {entry.value}
        </span>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChartsSection() {
  const [view, setView] = useState<ChartView>("line");
  const today = getTodayISO();

  // ─── Real data ───────────────────────────────────────────────────────────
  const { data: dsaLogs = [] } = useDSALogs();
  const { data: dsaStats } = useDSAStats();
  const { data: fitnessStats } = useFitnessStats();
  const { data: streak } = useStreak();
  const { data: tasks = [] } = useTasks(today);

  // ─── Build line chart data from DSA logs ─────────────────────────────────
  const lineData = [...dsaLogs]
    .sort((a, b) => a.solvedAt.localeCompare(b.solvedAt))
    .slice(-7)
    .map((log, i) => ({
      date: log.solvedAt.slice(5),
      dsa: i + 1,
    }));

  // ─── Build ring data from real stats ─────────────────────────────────────
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isDone).length;
  const taskPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const dsaPercent = Math.min(
    Math.round(((dsaStats?.total ?? 0) / 300) * 100),
    100,
  );
  const fitnessPercent = (() => {
    const current = Number(fitnessStats?.currentWeight ?? 139);
    const target = 85;
    const start = 139;
    const lost = start - current;
    const tolose = start - target;
    return Math.min(Math.round((lost / tolose) * 100), 100);
  })();
  const streakPercent = Math.min(
    Math.round(((streak?.currentStreak ?? 0) / 365) * 100),
    100,
  );

  const ringData = [
    { label: "DSA", value: dsaPercent, color: "#14B8A6" },
    { label: "Fitness", value: fitnessPercent, color: "#8b5cf6" },
    { label: "Tasks", value: taskPercent, color: "#06b6d4" },
    { label: "Streak", value: streakPercent, color: "#f97316" },
  ];

  return (
    <GlassCard padding="md" className="flex flex-col gap-4">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Progress Overview
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            {view === "line" ? "Last 7 DSA logs" : "Goal completion rings"}
          </p>
        </div>

        {/* Toggle */}
        <div
          className="flex items-center rounded-lg p-1 gap-1"
          style={{ background: "var(--muted)" }}
        >
          {(["line", "ring"] as ChartView[]).map((v) => (
            <motion.button
              key={v}
              onClick={() => setView(v)}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 capitalize"
              style={
                view === v
                  ? {
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }
                  : { color: "var(--muted-foreground)" }
              }
            >
              {v === "line" ? "Line" : "Rings"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart content */}
      <AnimatePresence mode="wait">
        {view === "line" ? (
          <motion.div
            key="line"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-52"
          >
            {lineData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  No DSA logs yet — start solving problems
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
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
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="dsa"
                    stroke="#14B8A6"
                    strokeWidth={2}
                    dot={{ fill: "#14B8A6", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="ring"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-around flex-wrap gap-4 py-4"
          >
            {ringData.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2"
              >
                <ProgressRing
                  value={item.value}
                  color={item.color}
                  size={90}
                  strokeWidth={7}
                  showPercent
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
