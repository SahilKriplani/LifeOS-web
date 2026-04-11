"use client";

import { motion, Variants } from "framer-motion";
import {
  Code2,
  Dumbbell,
  CalendarDays,
  Flame,
  Target,
  BarChart3,
} from "lucide-react";

// ─── Features data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Code2,
    title: "DSA Tracker",
    description:
      "Log every problem you solve. Track by topic, difficulty, and platform. Watch your 300+ problem journey unfold with beautiful charts.",
    color: "#14B8A6",
    tag: "For engineers",
  },
  {
    icon: Dumbbell,
    title: "Fitness Logger",
    description:
      "Daily weight, calories, and steps. Visualize your transformation from 139kg to 85kg with trend lines and milestone badges.",
    color: "#8b5cf6",
    tag: "For the body",
  },
  {
    icon: CalendarDays,
    title: "Daily Planner",
    description:
      "Dynamic task management with priority levels. Animated checkboxes, progress bars, and a clean daily view that keeps you focused.",
    color: "#06b6d4",
    tag: "For focus",
  },
  {
    icon: Flame,
    title: "Streak System",
    description:
      "Never break the chain. Visual streak calendar, current and best streak tracking, and daily check-ins to build unstoppable habits.",
    color: "#f97316",
    tag: "For discipline",
  },
  {
    icon: Target,
    title: "Goals Tracker",
    description:
      "Set long-term goals and track them with animated progress rings. Break big goals into milestones and celebrate every win.",
    color: "#ec4899",
    tag: "For ambition",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Line charts, ring charts, and weekly breakdowns across every module. See your life improving — week over week, month over month.",
    color: "#f59e0b",
    tag: "For insight",
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      {/* Background blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-5 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--glass-border)",
              color: "var(--primary)",
            }}
          >
            EVERYTHING YOU NEED
          </span>

          <h2
            className="text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Built for people who
            <br />
            <span style={{ color: "var(--primary)" }}>
              take their goals seriously.
            </span>
          </h2>

          <p
            className="text-base max-w-xl leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Every module is designed to work together — your DSA grind, your
            fitness journey, and your daily focus, all in one place.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl p-6 flex flex-col gap-4 cursor-default"
            >
              {/* Icon + tag row */}
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${feature.color}18` }}
                >
                  <feature.icon size={20} style={{ color: feature.color }} />
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {feature.tag}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3
                  className="text-base font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className="h-0.5 w-12 rounded-full mt-auto"
                style={{ background: feature.color }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
