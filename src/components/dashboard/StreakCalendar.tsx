"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/shared/GlassCard";
import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────
interface StreakCalendarProps {
  currentStreak: number;
  bestStreak: number;
  activeDates: string[]; // recent active days from the API, "YYYY-MM-DD"
}

// Local-time "YYYY-MM-DD" so generated day cells line up with the user's "today"
// (toISOString would shift to UTC and can land on the wrong calendar day).
function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_SPAN = 30; // trailing days shown in the heatmap

// ─── Component ────────────────────────────────────────────────────────────────
export default function StreakCalendar({
  currentStreak,
  bestStreak,
  activeDates,
}: StreakCalendarProps) {
  const activeSet = new Set(activeDates);
  const today = new Date();
  const todayISO = toLocalISO(today);

  // ─── This week (Monday-start, containing today) ──────────────────────────
  const jsDay = today.getDay(); // 0=Sun … 6=Sat
  const mondayOffset = jsDay === 0 ? 6 : jsDay - 1; // days back to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const weekDays = WEEKDAY_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = toLocalISO(d);
    return {
      label,
      iso,
      active: activeSet.has(iso),
      isToday: iso === todayISO,
      isFuture: iso > todayISO, // ISO date strings sort chronologically
    };
  });

  // ─── This month (trailing 30 days, oldest → today) ───────────────────────
  const monthDays = Array.from({ length: MONTH_SPAN }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (MONTH_SPAN - 1 - i));
    const iso = toLocalISO(d);
    return { iso, active: activeSet.has(iso), isToday: iso === todayISO };
  });

  return (
    <GlassCard padding="md" className="flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Streak Calendar
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            Keep the chain going
          </p>
        </div>

        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame size={20} className="text-orange-400" />
        </motion.div>
      </div>

      {/* Streak stats */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="flex flex-col gap-1 px-3 py-2.5 rounded-xl"
          style={{ background: "var(--muted)" }}
        >
          <span
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Current
          </span>
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-orange-400" />
            <span
              className="text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {currentStreak}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              days
            </span>
          </div>
        </div>

        <div
          className="flex flex-col gap-1 px-3 py-2.5 rounded-xl"
          style={{ background: "var(--muted)" }}
        >
          <span
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Best
          </span>
          <div className="flex items-center gap-1.5">
            <Trophy size={14} className="text-yellow-400" />
            <span
              className="text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {bestStreak}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              days
            </span>
          </div>
        </div>
      </div>

      {/* Weekly dots */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          This Week
        </span>
        <div className="flex items-center justify-between">
          {weekDays.map((day, i) => (
            <div key={day.iso} className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  day.isToday && "ring-2",
                )}
                style={{
                  background: day.active ? "var(--primary)" : "var(--muted)",
                  opacity: day.isFuture ? 0.4 : 1,
                }}
              >
                {day.active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.05 + 0.1 }}
                  >
                    <Flame
                      size={14}
                      style={{ color: "var(--primary-foreground)" }}
                    />
                  </motion.div>
                )}
              </motion.div>
              <span
                className="text-xs font-medium"
                style={{
                  color: day.isToday
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                }}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly heatmap */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          Last 30 Days
        </span>
        <div className="grid grid-cols-10 gap-1">
          {monthDays.map((day, i) => (
            <motion.div
              key={day.iso}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              title={day.iso}
              className={cn(
                "w-full aspect-square rounded-sm",
                day.isToday && "ring-2",
              )}
              style={{
                background: day.active ? "var(--primary)" : "var(--muted)",
                opacity: day.active ? 0.85 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
