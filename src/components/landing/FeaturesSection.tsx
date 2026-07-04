"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Code2,
  Dumbbell,
  Wallet,
  Flame,
  Target,
  Sparkles,
  BarChart3,
  Bell,
  NotebookPen,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function BentoCard({
  className,
  color,
  icon: Icon,
  title,
  desc,
  soon,
  children,
}: {
  className?: string;
  color: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  soon?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease }}
      whileHover={{ y: -4 }}
      className={cn(
        "group glass rounded-2xl p-6 flex flex-col gap-3 overflow-hidden relative cursor-default",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}1f` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {soon && (
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: `${color}1f`, color }}
          >
            Soon
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {desc}
        </p>
      </div>

      {children}

      <ArrowUpRight
        size={18}
        className="absolute top-5 right-5 opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-40 group-hover:translate-y-0"
        style={{ color: "var(--foreground)" }}
      />
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "var(--primary)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center text-center gap-4 mb-14"
        >
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide glass"
            style={{ color: "var(--primary)" }}
          >
            EVERYTHING, IN ONE PLACE
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Ten apps&apos; worth of life admin,
            <br />
            <span style={{ color: "var(--primary)" }}>finally under one roof.</span>
          </h2>
          <p className="text-base max-w-xl leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Stop stitching together Notion templates, spreadsheets, and habit
            apps. Every module shares the same data, so your whole life rolls up
            into one honest picture.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(200px,auto)]">
          {/* Planner — wide */}
          <BentoCard
            className="md:col-span-2"
            color="#0ea5e9"
            icon={CalendarDays}
            title="Daily Planner"
            desc="Priority-aware tasks with a clean daily view. Plan tonight, execute tomorrow."
          >
            <div className="mt-auto flex flex-col gap-2">
              {[
                { t: "Solve 2 DSA problems", done: true },
                { t: "Leg day — 45 min", done: true },
                { t: "Review monthly budget", done: false },
              ].map((row) => (
                <div
                  key={row.t}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm"
                  style={{ background: "var(--muted)", color: "var(--foreground)" }}
                >
                  <CheckCircle2
                    size={15}
                    style={{ color: row.done ? "#14B8A6" : "var(--muted-foreground)" }}
                  />
                  <span className={row.done ? "line-through opacity-60" : ""}>{row.t}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* AI Weekly Review — big */}
          <BentoCard
            className="md:col-span-2 lg:row-span-2"
            color="#14B8A6"
            icon={Sparkles}
            title="AI Weekly Review"
            desc="Every Sunday, LifeOS reads your real data and writes back what worked, what slipped, and the one thing to fix next week."
            soon
          >
            <div
              className="mt-auto rounded-xl p-4 flex flex-col gap-2.5 text-sm"
              style={{ background: "var(--muted)" }}
            >
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--primary)" }}>
                <Sparkles size={13} /> Your week, summarized
              </div>
              <p style={{ color: "var(--foreground)" }}>
                You shipped <b>38 of 45</b> tasks and solved <b>9</b> DSA problems —
                consistency was your edge.
              </p>
              <p style={{ color: "var(--muted-foreground)" }}>
                Weakest area: workouts dropped to 2 days. Next week, aim for 4 and
                protect your morning block.
              </p>
              <span className="text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                based on 6 logged days · grounded in your data, never invented
              </span>
            </div>
          </BentoCard>

          {/* DSA */}
          <BentoCard
            color="#14B8A6"
            icon={Code2}
            title="DSA Tracker"
            desc="Log every problem by topic, difficulty, and platform. Watch the curve climb."
          />

          {/* Fitness */}
          <BentoCard
            color="#8b5cf6"
            icon={Dumbbell}
            title="Fitness & Workouts"
            desc="Weight, calories, and a full workout logger with sets, reps, and a custom exercise library."
          />

          {/* Finance — wide */}
          <BentoCard
            className="md:col-span-2"
            color="#0ea5e9"
            icon={Wallet}
            title="Finance & Budgeting"
            desc="Track income and spending, set category budgets, and watch where the money actually goes — manual, private, no bank linking."
          >
            <div className="mt-auto flex flex-col gap-2.5">
              {[
                { label: "Groceries", pct: 80, color: "#0ea5e9" },
                { label: "Eating out", pct: 55, color: "#f97316" },
                { label: "Savings", pct: 92, color: "#14B8A6" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted-foreground)" }}>{b.label}</span>
                    <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                      {b.pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
                    <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Streaks */}
          <BentoCard
            color="#f97316"
            icon={Flame}
            title="Streaks & Habits"
            desc="Never break the chain. Daily check-ins, current and best streaks, visual calendar."
          />

          {/* Goals */}
          <BentoCard
            color="#ec4899"
            icon={Target}
            title="Goals"
            desc="Long-term goals with progress rings and milestones — including savings targets."
          />

          {/* Analytics — wide */}
          <BentoCard
            className="md:col-span-2"
            color="#f59e0b"
            icon={BarChart3}
            title="Analytics & Productivity Score"
            desc="One explainable 0–100 score across every module, with trends you can actually act on — not vanity charts."
            soon
          />

          {/* Reminders */}
          <BentoCard
            color="#eab308"
            icon={Bell}
            title="Smart Reminders"
            desc="Nudges for streaks at risk, recurring bills, and goals falling behind."
            soon
          />

          {/* Notes */}
          <BentoCard
            color="#a855f7"
            icon={NotebookPen}
            title="Notes & Journal"
            desc="Quick markdown notes that feed your AI weekly insights. No bloated block editor."
            soon
          />
        </div>
      </div>
    </section>
  );
}
