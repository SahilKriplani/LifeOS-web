"use client";

import type { DSAStats } from "@/types";
import { motion } from "framer-motion";
import { Brain, Code2, TrendingUp, Zap } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────
interface DSAStatsRowProps {
  stats: DSAStats;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
  icon: Icon,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col gap-3 p-5 rounded-xl"
      style={{
        background: "var(--muted)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>

      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        {value}
      </motion.span>

      {/* Bottom accent */}
      <div className="h-0.5 w-8 rounded-full" style={{ background: color }} />
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DSAStatsRow({ stats }: DSAStatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Solved"
        value={stats.total}
        color="#14B8A6"
        icon={Code2}
        delay={0}
      />
      <StatCard
        label="Easy"
        value={stats.easy}
        color="#10b981"
        icon={Zap}
        delay={0.1}
      />
      <StatCard
        label="Medium"
        value={stats.medium}
        color="#f59e0b"
        icon={Brain}
        delay={0.2}
      />
      <StatCard
        label="Hard"
        value={stats.hard}
        color="#f43f5e"
        icon={TrendingUp}
        delay={0.3}
      />
    </div>
  );
}
