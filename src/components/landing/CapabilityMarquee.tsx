"use client";

import {
  CalendarDays,
  Target,
  Code2,
  Dumbbell,
  Wallet,
  Flame,
  NotebookPen,
  Sparkles,
  BarChart3,
  Bell,
  Trophy,
  Repeat,
} from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

// Breadth IS the pitch — one glance should say "this runs my whole life".
const capabilities = [
  { icon: CalendarDays, label: "Daily Planner", color: "#0ea5e9" },
  { icon: Target, label: "Goals", color: "#14B8A6" },
  { icon: Code2, label: "DSA Tracker", color: "#14B8A6" },
  { icon: Dumbbell, label: "Fitness", color: "#8b5cf6" },
  { icon: Wallet, label: "Finance", color: "#0ea5e9" },
  { icon: Flame, label: "Streaks", color: "#f97316" },
  { icon: NotebookPen, label: "Notes", color: "#a855f7" },
  { icon: Sparkles, label: "AI Weekly Review", color: "#14B8A6" },
  { icon: BarChart3, label: "Analytics", color: "#0ea5e9" },
  { icon: Bell, label: "Reminders", color: "#f97316" },
  { icon: Trophy, label: "Milestones", color: "#eab308" },
  { icon: Repeat, label: "Recurring", color: "#8b5cf6" },
];

export default function CapabilityMarquee() {
  return (
    <section className="relative py-8 overflow-hidden">
      <p
        className="text-center text-xs font-semibold uppercase tracking-[0.2em] mb-6"
        style={{ color: "var(--muted-foreground)" }}
      >
        One app for every part of your life
      </p>

      <div className="relative">
        <Marquee pauseOnHover className="[--duration:38s]">
          {capabilities.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full glass shrink-0"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${c.color}22` }}
              >
                <c.icon size={15} style={{ color: c.color }} />
              </div>
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: "var(--foreground)" }}
              >
                {c.label}
              </span>
            </div>
          ))}
        </Marquee>

        {/* Edge fades so the strip dissolves instead of hard-cutting */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
          style={{
            background:
              "linear-gradient(to right, var(--background), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
          style={{
            background:
              "linear-gradient(to left, var(--background), transparent)",
          }}
        />
      </div>
    </section>
  );
}
