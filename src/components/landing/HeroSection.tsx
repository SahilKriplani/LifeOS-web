"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  Dumbbell,
  CalendarDays,
  Flame,
  TrendingUp,
  Target,
} from "lucide-react";

// ─── Floating card data ───────────────────────────────────────────────────────
const floatingCards = [
  {
    id: 1,
    icon: Code2,
    label: "DSA Solved",
    value: "142",
    sub: "problems",
    color: "#14B8A6",
    position: "top-8 right-0",
    delay: 0,
  },
  {
    id: 2,
    icon: Flame,
    label: "Current Streak",
    value: "21",
    sub: "days",
    color: "#f97316",
    position: "top-40 -right-8",
    delay: 0.1,
  },
  {
    id: 3,
    icon: Dumbbell,
    label: "Weight",
    value: "134",
    sub: "kg → 85kg",
    color: "#8b5cf6",
    position: "bottom-32 -right-4",
    delay: 0.2,
  },
  {
    id: 4,
    icon: CalendarDays,
    label: "Tasks Today",
    value: "8/10",
    sub: "completed",
    color: "#06b6d4",
    position: "bottom-8 right-8",
    delay: 0.3,
  },
];

// ─── Badge pills ──────────────────────────────────────────────────────────────
const badges = [
  "DSA Tracker",
  "Fitness Log",
  "Daily Planner",
  "Streak System",
  "Goal Rings",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "64px" }}
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--secondary)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── Left — Text content ── */}
          <div className="flex flex-col gap-8">
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit text-xs font-semibold tracking-wide"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
                color: "var(--primary)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--primary)" }}
              />
              Now in development — v1.0 coming soon
            </motion.div>

            {/* Headline */}
            <div className="flex flex-col gap-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                One dashboard.
                <br />
                <span style={{ color: "var(--primary)" }}>Every goal.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg leading-relaxed max-w-md"
                style={{ color: "var(--muted-foreground)" }}
              >
                LifeOS is your personal operating system — track DSA progress,
                fitness goals, daily tasks, and streaks in one beautifully
                designed workspace.
              </motion.p>
            </div>

            {/* Badge pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {badges.map((badge, i) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03, opacity: 0.92 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <TrendingUp size={16} />
                  Start Tracking
                </motion.button>
              </Link>

              <a href="#features">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
                  style={{
                    border: "1px solid var(--glass-border)",
                    color: "var(--foreground)",
                    background: "var(--muted)",
                  }}
                >
                  <Target size={16} />
                  See Features
                </motion.button>
              </a>
            </motion.div>
          </div>

          {/* ── Right — Floating cards visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center h-130"
          >
            {/* Center dashboard mockup */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass rounded-2xl p-6 w-72 shadow-2xl"
            >
              {/* Mock header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Good morning
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Sahil 👋
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--muted)",
                    color: "#f97316",
                  }}
                >
                  <Flame size={12} />
                  21 days
                </div>
              </div>

              {/* Mock stat bars */}
              <div className="flex flex-col gap-3">
                {[
                  { label: "DSA Progress", value: 47, color: "var(--primary)" },
                  { label: "Fitness Goal", value: 32, color: "#8b5cf6" },
                  { label: "Daily Tasks", value: 80, color: "#06b6d4" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {stat.label}
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {stat.value}%
                      </span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{ background: "var(--muted)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{
                          duration: 1.2,
                          delay: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{ background: stat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating stat cards */}
            {floatingCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + card.delay }}
                className={`absolute ${card.position} glass rounded-xl px-4 py-3 flex items-center gap-3`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${card.color}20` }}
                >
                  <card.icon size={15} style={{ color: card.color }} />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {card.label}
                  </div>
                  <div
                    className="text-sm font-bold leading-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    {card.value}{" "}
                    <span
                      className="text-xs font-normal"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {card.sub}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
