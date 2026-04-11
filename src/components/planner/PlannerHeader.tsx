"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { formatDate, getTodayISO } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";

// ─── Props ────────────────────────────────────────────────────────────────────
interface PlannerHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  totalTasks: number;
  completedTasks: number;
  onAddTask: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shiftDate(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function isToday(date: string): boolean {
  return date === getTodayISO();
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PlannerHeader({
  selectedDate,
  onDateChange,
  totalTasks,
  completedTasks,
  onAddTask,
}: PlannerHeaderProps) {
  const percent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Top row */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        {/* Left — title + date nav */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={20} style={{ color: "var(--primary)" }} />
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Daily Planner
            </h1>
          </div>

          {/* Date navigation */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateChange(shiftDate(selectedDate, -1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <ChevronLeft size={15} />
            </motion.button>

            {/* Date display */}
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-1.5 rounded-lg text-sm font-medium"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
                color: "var(--foreground)",
                minWidth: "180px",
                textAlign: "center",
              }}
            >
              {isToday(selectedDate)
                ? `Today — ${formatDate(selectedDate)}`
                : formatDate(selectedDate)}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateChange(shiftDate(selectedDate, 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <ChevronRight size={15} />
            </motion.button>

            {/* Jump to today */}
            {!isToday(selectedDate) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDateChange(getTodayISO())}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                style={{
                  background: "var(--muted)",
                  color: "var(--primary)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                Today
              </motion.button>
            )}
          </div>
        </div>

        {/* Right — add task button */}
        <ShimmerButton
          onClick={onAddTask}
          shimmerColor="var(--accent)"
          background="var(--primary)"
          className="h-10 px-5 text-sm font-semibold rounded-xl"
        >
          + Add Task
        </ShimmerButton>
      </div>

      {/* Stats bar */}
      <div
        className="flex items-center gap-6 px-5 py-3 rounded-xl"
        style={{
          background: "var(--muted)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Total
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {totalTasks}
          </span>
        </div>

        <div
          className="w-px h-8"
          style={{ background: "var(--glass-border)" }}
        />

        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Done
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: "var(--primary)" }}
          >
            {completedTasks}
          </span>
        </div>

        <div
          className="w-px h-8"
          style={{ background: "var(--glass-border)" }}
        />

        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Remaining
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {totalTasks - completedTasks}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1.5 ml-4">
          <div className="flex justify-between">
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              Daily completion
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--primary)" }}
            >
              {percent}%
            </span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--glass-border)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "var(--primary)" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
