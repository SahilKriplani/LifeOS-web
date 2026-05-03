"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import FitnessStatsRow from "@/components/fitness/FitnessStatsRow";
import FitnessLogModal from "@/components/fitness/FitnessLogModal";
import GlassCard from "@/components/shared/GlassCard";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Dumbbell, Scale, Flame, Footprints, Trash2 } from "lucide-react";
import {
  useFitnessLogs,
  useFitnessStats,
  useCreateFitnessLog,
  useDeleteFitnessLog,
} from "@/hooks/useFitness";
import type { CreateFitnessLogPayload } from "@/types";
import toast from "react-hot-toast";

// ─── Chart view type ──────────────────────────────────────────────────────────
type ChartTab = "weight" | "calories" | "steps";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-xl animate-pulse"
          style={{ background: "var(--muted)" }}
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FitnessPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [chartTab, setChartTab] = useState<ChartTab>("weight");

  // ─── Queries ────────────────────────────────────────────────────────────────
  const { data: logs = [], isLoading: logsLoading } = useFitnessLogs();
  const { data: stats, isLoading: statsLoading } = useFitnessStats();
  const createLog = useCreateFitnessLog();
  const deleteLog = useDeleteFitnessLog();

  // ─── Chart data ───────────────────────────────────────────────────────────
  const chartData = [...logs]
    .sort((a, b) => a.logDate.localeCompare(b.logDate))
    .map((l) => ({
      date: l.logDate.slice(5),
      weight: Number(l.weightKg),
      calories: l.calories,
      steps: l.steps,
    }));

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleLog = (payload: CreateFitnessLogPayload) => {
    createLog.mutate(payload, {
      onSuccess: () => toast.success("Fitness log saved! 💪"),
      onError: () => toast.error("Failed to save log"),
    });
  };

  const handleDelete = (id: number) => {
    deleteLog.mutate(id, {
      onSuccess: () => toast.success("Log deleted"),
      onError: () => toast.error("Failed to delete log"),
    });
  };

  const chartConfig = {
    weight: {
      key: "weight",
      color: "#14B8A6",
      label: "Weight (kg)",
      type: "line" as const,
    },
    calories: {
      key: "calories",
      color: "#f59e0b",
      label: "Calories",
      type: "bar" as const,
    },
    steps: {
      key: "steps",
      color: "#06b6d4",
      label: "Steps",
      type: "bar" as const,
    },
  };

  const active = chartConfig[chartTab];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Dumbbell size={20} style={{ color: "var(--primary)" }} />
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Fitness Tracker
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {logs.length} days logged — 139kg → 85kg journey
          </p>
        </div>
        <ShimmerButton
          onClick={() => setModalOpen(true)}
          shimmerColor="var(--accent)"
          background="var(--primary)"
          className="h-10 px-5 text-sm font-semibold rounded-xl"
        >
          + Log Today
        </ShimmerButton>
      </motion.div>

      {/* Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl animate-pulse"
              style={{ background: "var(--muted)" }}
            />
          ))}
        </div>
      ) : (
        <FitnessStatsRow
          currentWeight={Number(stats?.currentWeight ?? 0)}
          targetWeight={85}
          calories={Math.round(stats?.averageCalories ?? 0)}
          steps={Math.round(stats?.averageSteps ?? 0)}
        />
      )}

      {/* Charts */}
      <GlassCard padding="md" className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Progress Charts
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              Last {logs.length} days
            </p>
          </div>

          {/* Chart tabs */}
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{ background: "var(--muted)" }}
          >
            {(["weight", "calories", "steps"] as ChartTab[]).map((tab) => {
              const icons = {
                weight: Scale,
                calories: Flame,
                steps: Footprints,
              };
              const Icon = icons[tab];
              return (
                <motion.button
                  key={tab}
                  onClick={() => setChartTab(tab)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
                  style={
                    chartTab === tab
                      ? {
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  <Icon size={12} />
                  {tab}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        <motion.div
          key={chartTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-52"
        >
          <ResponsiveContainer width="100%" height="100%">
            {active.type === "line" ? (
              <LineChart data={chartData}>
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
                  domain={["auto", "auto"]}
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
                  dataKey={active.key}
                  stroke={active.color}
                  strokeWidth={2.5}
                  dot={{ fill: active.color, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
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
                <Bar
                  dataKey={active.key}
                  fill={active.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>
      </GlassCard>

      {/* Log table */}
      <GlassCard padding="md" className="flex flex-col gap-4">
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Daily Logs
        </h3>

        {logsLoading ? (
          <Skeleton rows={5} />
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Dumbbell size={24} style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              No logs yet — start tracking today
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Header row */}
            <div
              className="grid grid-cols-5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              <span>Date</span>
              <span>Weight</span>
              <span>Calories</span>
              <span>Steps</span>
              <span>Notes</span>
            </div>

            {/* Log rows */}
            {[...logs]
              .sort((a, b) => b.logDate.localeCompare(a.logDate))
              .map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group grid grid-cols-5 px-4 py-3 rounded-xl text-sm items-center"
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <span style={{ color: "var(--muted-foreground)" }}>
                    {log.logDate}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    {log.weightKg} kg
                  </span>
                  <span style={{ color: "var(--foreground)" }}>
                    {log.calories} kcal
                  </span>
                  <span style={{ color: "var(--foreground)" }}>
                    {Number(log.steps).toLocaleString()}
                  </span>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs truncate max-w-20"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {log.notes || "—"}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(log.id)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background: "rgba(244,63,94,0.1)",
                        color: "#f43f5e",
                      }}
                    >
                      <Trash2 size={11} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </GlassCard>

      {/* Modal */}
      <FitnessLogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleLog}
      />
    </div>
  );
}
