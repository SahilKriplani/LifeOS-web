"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Layers, IndianRupee, LayoutDashboard, Download } from "lucide-react";

// ─── Stats data ───────────────────────────────────────────────────────────────
const stats = [
  {
    icon: Layers,
    value: "10+",
    label: "Life modules",
    sub: "Planner, goals, fitness, finance & more",
    color: "#14B8A6",
  },
  {
    icon: IndianRupee,
    value: "₹0",
    label: "To get started",
    sub: "Free-forever core — no card needed",
    color: "#8b5cf6",
  },
  {
    icon: LayoutDashboard,
    value: "1",
    label: "Unified dashboard",
    sub: "Replaces six scattered apps",
    color: "#06b6d4",
  },
  {
    icon: Download,
    value: "100%",
    label: "Your data",
    sub: "Export to CSV / JSON anytime",
    color: "#ec4899",
  },
];

// ─── Animated number component ────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  value,
  label,
  sub,
  color,
  index,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  sub: string;
  color: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass rounded-2xl p-8 flex flex-col items-center text-center gap-4"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon size={22} style={{ color }} />
      </div>

      {/* Value */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{
          duration: 0.6,
          delay: index * 0.1 + 0.2,
          type: "spring",
          stiffness: 150,
        }}
        className="text-4xl font-bold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        {value}
      </motion.div>

      {/* Label + sub */}
      <div className="flex flex-col gap-1">
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {label}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </span>
      </div>

      {/* Bottom accent */}
      <div className="h-0.5 w-10 rounded-full" style={{ background: color }} />
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StatsSection() {
  return (
    <section id="stats" className="py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--secondary)" }}
        />
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--accent)" }}
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
            WHY LIFEOS
          </span>

          <h2
            className="text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Everything you were juggling,
            <br />
            <span style={{ color: "var(--primary)" }}>
              now in one place.
            </span>
          </h2>

          <p
            className="text-base max-w-lg leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Stop scattering your life across six apps and a graveyard of Notion
            templates. LifeOS brings every part of it into one calm, fast
            dashboard — and your data stays yours.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-col items-center text-center gap-3"
        >
          <div
            className="w-px h-12"
            style={{ background: "var(--glass-border)" }}
          />
          <p
            className="text-sm italic max-w-md"
            style={{ color: "var(--muted-foreground)" }}
          >
            One operating system for your tasks, habits, fitness, finances and
            goals — built to keep up with you, not the other way around.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
