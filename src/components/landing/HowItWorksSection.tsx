"use client";

import { motion } from "framer-motion";
import { UserPlus, ListChecks, Sparkles } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign up in seconds",
    desc: "Email or Google — no credit card, no setup wizard. Your modules are ready the moment you land.",
    color: "#14B8A6",
  },
  {
    icon: ListChecks,
    step: "02",
    title: "Track your day",
    desc: "Plan tasks, log DSA and workouts, check in on streaks, and jot down spending. One tab for all of it.",
    color: "#0ea5e9",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get your weekly review",
    desc: "Every Sunday, LifeOS turns your real data into a clear picture of what worked and the one thing to fix next.",
    color: "#8b5cf6",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how" className="py-28 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide glass"
            style={{ color: "var(--primary)" }}
          >
            HOW IT WORKS
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Up and running in{" "}
            <span style={{ color: "var(--primary)" }}>three steps.</span>
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--glass-border), transparent)",
            }}
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
              className="relative flex flex-col items-center text-center gap-4"
            >
              <div
                className="relative w-16 h-16 rounded-2xl glass flex items-center justify-center"
                style={{ background: `${s.color}14` }}
              >
                <s.icon size={26} style={{ color: s.color }} />
                <span
                  className="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: s.color, color: "#fff" }}
                >
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
