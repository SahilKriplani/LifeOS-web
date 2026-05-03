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
} from "recharts";
import DSAHeader from "@/components/dsa/DSAHeader";
import DSAStatsRow from "@/components/dsa/DSAStatsRow";
import DSALogList from "@/components/dsa/DSALogList";
import DSALogModal from "@/components/dsa/DSALogModal";
import GlassCard from "@/components/shared/GlassCard";
import {
  useDSALogs,
  useDSAStats,
  useCreateDSALog,
  useDeleteDSALog,
} from "@/hooks/useDSA";
import type { CreateDSALogPayload, DSAStats } from "@/types";
import toast from "react-hot-toast";

// ─── Filter type ──────────────────────────────────────────────────────────────
type FilterType = "all" | "easy" | "medium" | "hard";

const filters: { label: string; value: FilterType; color: string }[] = [
  { label: "All", value: "all", color: "var(--primary)" },
  { label: "Easy", value: "easy", color: "#10b981" },
  { label: "Medium", value: "medium", color: "#f59e0b" },
  { label: "Hard", value: "hard", color: "#f43f5e" },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map((_, i) => (
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
export default function DSAPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  // ─── Queries ────────────────────────────────────────────────────────────────
  const { data: logs = [], isLoading: logsLoading } = useDSALogs();
  const { data: statsData, isLoading: statsLoading } = useDSAStats();
  const createLog = useCreateDSALog();
  const deleteLog = useDeleteDSALog();

  // ─── Stats fallback ───────────────────────────────────────────────────────
  const stats: DSAStats = statsData ?? {
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    byTopic: {},
  };

  // ─── Chart data ───────────────────────────────────────────────────────────
  const chartData = [...logs]
    .sort((a, b) => a.solvedAt.localeCompare(b.solvedAt))
    .reduce(
      (acc, log, i) => {
        acc.push({
          date: log.solvedAt.slice(5),
          solved: i + 1,
        });
        return acc;
      },
      [] as { date: string; solved: number }[],
    );

  // ─── Filtered logs ────────────────────────────────────────────────────────
  const filteredLogs =
    filter === "all" ? logs : logs.filter((l) => l.difficulty === filter);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleLog = (payload: CreateDSALogPayload) => {
    createLog.mutate(payload, {
      onSuccess: () => toast.success("Problem logged! 🎉"),
      onError: () => toast.error("Failed to log problem"),
    });
  };

  const handleDelete = (id: number) => {
    deleteLog.mutate(id, {
      onSuccess: () => toast.success("Log deleted"),
      onError: () => toast.error("Failed to delete log"),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <DSAHeader total={stats.total} onLogProblem={() => setModalOpen(true)} />

      {/* Stats row */}
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
        <DSAStatsRow stats={stats} />
      )}

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
        {logsLoading ? (
          <Skeleton />
        ) : (
          <DSALogList logs={filteredLogs} onDelete={handleDelete} />
        )}
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
