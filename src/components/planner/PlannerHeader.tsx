"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { formatDate, getTodayISO } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface PlannerHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  totalTasks: number;
  completedTasks: number;
  onAddTask: () => void;
}

function shiftDate(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function isToday(date: string): boolean {
  return date === getTodayISO();
}

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
      className="flex flex-col gap-4"
    >
      {/* Top row */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} style={{ color: "var(--primary)" }} />
            <h1
              className="text-xl md:text-2xl font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Daily Planner
            </h1>
          </div>

          {/* Date navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateChange(shiftDate(selectedDate, -1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <ChevronLeft size={15} />
            </motion.button>

            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-center"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
                color: "var(--foreground)",
                minWidth: "140px",
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
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <ChevronRight size={15} />
            </motion.button>

            {!isToday(selectedDate) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDateChange(getTodayISO())}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
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

        <ShimmerButton
          onClick={onAddTask}
          shimmerColor="var(--accent)"
          background="var(--primary)"
          className="h-9 md:h-10 px-4 md:px-5 text-xs md:text-sm font-semibold rounded-xl"
        >
          + Add Task
        </ShimmerButton>
      </div>

      {/* Stats bar */}
      <div
        className="flex items-center gap-3 md:gap-6 px-4 py-3 rounded-xl flex-wrap"
        style={{
          background: "var(--muted)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {[
          { label: "Total", value: totalTasks },
          { label: "Done", value: completedTasks, color: "var(--primary)" },
          { label: "Remaining", value: totalTasks - completedTasks },
        ].map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-3">
            {i > 0 && (
              <div
                className="w-px h-6 hidden sm:block"
                style={{ background: "var(--glass-border)" }}
              />
            )}
            <div className="flex flex-col gap-0.5">
              <span
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                {stat.label}
              </span>
              <span
                className="text-base md:text-lg font-bold"
                style={{ color: stat.color ?? "var(--foreground)" }}
              >
                {stat.value}
              </span>
            </div>
          </div>
        ))}

        {/* Progress bar */}
        <div className="flex-1 min-w-32 flex flex-col gap-1.5 ml-0 sm:ml-4">
          <div className="flex justify-between">
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              Progress
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
