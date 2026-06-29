"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Dumbbell,
  Wallet,
  Flame,
  Target,
  CheckCircle2,
} from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";

const ease = [0.16, 1, 0.3, 1] as const;

// Pillars shown as a small proof row — the breadth that makes LifeOS a
// "run your whole life" product rather than a single-purpose tracker.
const pillars = ["Planner", "Goals", "DSA", "Fitness", "Finance", "AI Review"];

// Floating glass chips around the product window.
const floatingCards = [
  {
    icon: Code2,
    label: "DSA solved",
    value: "142",
    sub: "this month",
    color: "#14B8A6",
    className: "-top-12 left-6",
    delay: 0.6,
  },
  {
    icon: Flame,
    label: "Streak",
    value: "21",
    sub: "days",
    color: "#f97316",
    className: "-bottom-6 -right-6",
    delay: 0.75,
  },
  {
    icon: Wallet,
    label: "Budget left",
    value: "₹18.4k",
    sub: "of ₹40k",
    color: "#0ea5e9",
    className: "-bottom-7 -left-6",
    delay: 0.9,
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16">
      {/* Raycast-style radial wash */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[70%] opacity-[0.18] blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, var(--primary) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-[10%] w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-10 items-center">
          {/* ── Left: copy ── */}
          <div className="flex flex-col gap-7 text-center lg:text-left items-center lg:items-start">
            <motion.a
              href="#features"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide glass-nav"
              style={{ color: "var(--primary)" }}
            >
              <Sparkles size={13} />
              The operating system for your entire life
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              className="text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.1rem] font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Run your whole life
              <br />
              from{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(110deg, var(--primary), var(--accent) 55%, var(--secondary))",
                }}
              >
                one dashboard
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease }}
              className="text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: "var(--muted-foreground)" }}
            >
              Notion makes you build your life from scratch. LifeOS ships it
              ready — planner, goals, habits, fitness, finances and an AI that
              reviews your week. Opinionated, fast, and built to actually move
              the needle.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease }}
              className="flex flex-col sm:flex-row items-center gap-3 pt-1"
            >
              <Link href="/register">
                <ShimmerButton
                  background="var(--primary)"
                  shimmerColor="#ffffff"
                  borderRadius="12px"
                  className="px-7 py-3 text-sm font-semibold shadow-lg"
                >
                  <span className="flex items-center gap-2 text-white">
                    Get started free
                    <ArrowRight size={16} />
                  </span>
                </ShimmerButton>
              </Link>

              <a href="#features">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium glass"
                  style={{ color: "var(--foreground)" }}
                >
                  <Target size={16} />
                  See how it works
                </motion.button>
              </a>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34, ease }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 pt-2 text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} style={{ color: "var(--primary)" }} />
                Free forever plan
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} style={{ color: "var(--primary)" }} />
                No credit card
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} style={{ color: "var(--primary)" }} />
                Your data, exportable
              </span>
            </motion.div>

            {/* Pillar chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease }}
              className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2"
            >
              {pillars.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.46 + i * 0.05 }}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {p}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: product window ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative glass-strong rounded-2xl w-full max-w-md p-1 shadow-2xl"
            >
              <BorderBeam
                size={120}
                duration={8}
                colorFrom="var(--primary)"
                colorTo="var(--accent)"
              />
              <div className="rounded-xl overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
                  <span className="ml-3 text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                    lifeos — today
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  {/* Greeting + score ring */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        Good morning
                      </div>
                      <div className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                        Sahil 👋
                      </div>
                    </div>
                    <ScoreRing value={78} />
                  </div>

                  {/* Stat progress bars */}
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: "DSA progress", value: 64, color: "var(--primary)" },
                      { label: "Fitness goal", value: 41, color: "#8b5cf6" },
                      { label: "Daily tasks", value: 80, color: "#0ea5e9" },
                    ].map((s) => (
                      <div key={s.label} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span style={{ color: "var(--muted-foreground)" }}>{s.label}</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                            {s.value}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.value}%` }}
                            transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: s.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mini finance + workout row */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <MiniStat icon={Wallet} tint="#0ea5e9" label="Spent today" value="₹640" />
                    <MiniStat icon={Dumbbell} tint="#8b5cf6" label="Workout" value="Push day" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating chips */}
            {floatingCards.map((c) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: c.delay, ease }}
                className={`absolute ${c.className} hidden sm:flex items-center gap-2.5 glass rounded-xl px-3.5 py-2.5`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${c.color}22` }}
                >
                  <c.icon size={15} style={{ color: c.color }} />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    {c.label}
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {c.value}{" "}
                    <span className="text-[10px] font-normal" style={{ color: "var(--muted-foreground)" }}>
                      {c.sub}
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

// Small circular productivity-score ring.
function ScoreRing({ value }: { value: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="4" stroke="var(--muted)" />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          stroke="var(--primary)"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (value / 100) * circ }}
          transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
        style={{ color: "var(--foreground)" }}
      >
        {value}
      </span>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  tint,
  label,
  value,
}: {
  icon: React.ElementType;
  tint: string;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-lg px-3 py-2.5 flex items-center gap-2.5"
      style={{ background: "var(--muted)" }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${tint}22` }}
      >
        <Icon size={14} style={{ color: tint }} />
      </div>
      <div className="leading-tight">
        <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </div>
        <div className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}
