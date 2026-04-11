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
import type { ChartView } from "@/types";

// ─── Mock data ────────────────────────────────────────────────────────────────
const lineData = [
  { date: "Apr 1", dsa: 2, fitness: 60 },
  { date: "Apr 2", dsa: 5, fitness: 58 },
  { date: "Apr 3", dsa: 7, fitness: 57 },
  { date: "Apr 4", dsa: 10, fitness: 56 },
  { date: "Apr 5", dsa: 12, fitness: 55 },
  { date: "Apr 6", dsa: 15, fitness: 54 },
  { date: "Apr 7", dsa: 18, fitness: 53 },
];

const ringData = [
  { label: "DSA", value: 47, color: "#14B8A6" },
  { label: "Fitness", value: 32, color: "#8b5cf6" },
  { label: "Tasks", value: 80, color: "#06b6d4" },
  { label: "Streak", value: 60, color: "#f97316" },
];

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
            Last 7 days
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
                <Line
                  type="monotone"
                  dataKey="fitness"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
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
