"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
import { useFinanceSummary } from "@/hooks/useFinance";

// ─── View metadata ────────────────────────────────────────────────────────────
const VIEW_LABEL: Record<ChartView, string> = {
  line: "Line",
  ring: "Rings",
  finance: "Finance",
};
const VIEW_SUBTITLE: Record<ChartView, string> = {
  line: "Cumulative problems solved",
  ring: "Goal completion rings",
  finance: "Income vs expense · last 30 days",
};

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
      {payload.map((entry) => {
        const isMoney =
          entry.dataKey === "income" || entry.dataKey === "expense";
        const name =
          entry.dataKey === "dsa"
            ? "Total solved"
            : entry.dataKey === "income"
              ? "Income"
              : entry.dataKey === "expense"
                ? "Expense"
                : "Weight (kg)";
        return (
          <span key={entry.dataKey} style={{ color: entry.color }}>
            {name}: {isMoney ? `₹${entry.value.toLocaleString("en-IN")}` : entry.value}
          </span>
        );
      })}
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
  const { data: finance } = useFinanceSummary(30);

  // ─── Finance series (income vs expense per day) ──────────────────────────
  const financeData = (finance?.daily ?? []).map((d) => ({
    date: d.date.slice(5),
    income: d.income,
    expense: d.expense,
  }));
  const hasFinanceData =
    (finance?.totalIncome ?? 0) > 0 || (finance?.totalExpense ?? 0) > 0;

  // ─── Build line chart data from DSA logs ─────────────────────────────────
  // Group logs by day, then plot the running cumulative total across the last 7
  // active days. (The old version plotted the row index 1→7, which was
  // meaningless — every window looked identical regardless of real activity.)
  const perDay = new Map<string, number>();
  for (const log of dsaLogs) {
    const day = log.solvedAt.slice(0, 10);
    perDay.set(day, (perDay.get(day) ?? 0) + 1);
  }
  const recentDays = [...perDay.keys()].sort().slice(-7);
  const lineData = recentDays.reduce<{ date: string; dsa: number }[]>(
    (acc, day) => {
      const prev = acc.length ? acc[acc.length - 1].dsa : 0;
      acc.push({ date: day.slice(5), dsa: prev + (perDay.get(day) ?? 0) });
      return acc;
    },
    [],
  );

  // ─── Build ring data from real stats ─────────────────────────────────────
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isDone).length;
  const taskPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const dsaPercent = Math.min(
    Math.round(((dsaStats?.total ?? 0) / 300) * 100),
    100,
  );
  // Ring fills as the user moves from their starting weight toward their goal.
  // Needs a real goal + a start strictly above it, otherwise there's nothing to
  // measure progress against, so we render an empty ring rather than fake data.
  const fitnessPercent = (() => {
    const start = fitnessStats?.startWeight ?? null;
    const target = fitnessStats?.targetWeight ?? null;
    const current = fitnessStats?.currentWeight ?? null;
    if (start === null || target === null || current === null) return 0;
    if (start <= target) return 0; // goal already met or misconfigured
    const lost = start - current;
    const toLose = start - target;
    return Math.max(0, Math.min(Math.round((lost / toLose) * 100), 100));
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
            {VIEW_SUBTITLE[view]}
          </p>
        </div>

        {/* Toggle */}
        <div
          className="flex items-center rounded-lg p-1 gap-1"
          style={{ background: "var(--muted)" }}
        >
          {(["line", "ring", "finance"] as ChartView[]).map((v) => (
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
              {VIEW_LABEL[v]}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart content */}
      <AnimatePresence mode="wait">
        {view === "line" && (
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
        )}
        {view === "ring" && (
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
        {view === "finance" && (
          <motion.div
            key="finance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-52"
          >
            {!hasFinanceData ? (
              <div className="h-full flex items-center justify-center">
                <p
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  No transactions yet — add an expense or income above
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financeData}>
                  <defs>
                    <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--glass-border)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#fillIncome)"
                    animationDuration={800}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#fillExpense)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
