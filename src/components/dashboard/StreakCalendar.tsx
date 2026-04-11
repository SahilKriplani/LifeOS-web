"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/shared/GlassCard";
import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockWeekData = [
  { date: "Mon", active: true },
  { date: "Tue", active: true },
  { date: "Wed", active: true },
  { date: "Thu", active: true },
  { date: "Fri", active: true },
  { date: "Sat", active: false },
  { date: "Sun", active: false },
];

const mockMonthData: boolean[] = [
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  false,
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  false,
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface StreakCalendarProps {
  currentStreak: number;
  bestStreak: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function StreakCalendar({
  currentStreak,
  bestStreak,
}: StreakCalendarProps) {
  const today = new Date().getDay();
  // Convert Sunday=0 to Monday=0 based index
  const todayIndex = today === 0 ? 6 : today - 1;

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
          {mockWeekData.map((day, i) => (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  i === todayIndex && "ring-2",
                )}
                style={{
                  background: day.active ? "var(--primary)" : "var(--muted)",
                  opacity: i > todayIndex ? 0.4 : 1,
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
                  color:
                    i === todayIndex
                      ? "var(--primary)"
                      : "var(--muted-foreground)",
                }}
              >
                {day.date}
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
          This Month
        </span>
        <div className="grid grid-cols-10 gap-1">
          {mockMonthData.map((active, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="w-full aspect-square rounded-sm"
              style={{
                background: active ? "var(--primary)" : "var(--muted)",
                opacity: active ? 0.85 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
