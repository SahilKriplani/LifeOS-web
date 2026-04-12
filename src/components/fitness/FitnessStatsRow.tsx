"use client";

import { motion } from "framer-motion";
import { Scale, Flame, Footprints, TrendingDown } from "lucide-react";

interface FitnessStatsRowProps {
  currentWeight: number;
  targetWeight: number;
  calories: number;
  steps: number;
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string;
  sub: string;
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
      <div className="flex flex-col gap-0.5">
        <span
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {value}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </span>
      </div>
      <div className="h-0.5 w-8 rounded-full" style={{ background: color }} />
    </motion.div>
  );
}

export default function FitnessStatsRow({
  currentWeight,
  targetWeight,
  calories,
  steps,
}: FitnessStatsRowProps) {
  const tolose = (currentWeight - targetWeight).toFixed(1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Current Weight"
        value={`${currentWeight} kg`}
        sub={`Target: ${targetWeight} kg`}
        color="#14B8A6"
        icon={Scale}
        delay={0}
      />
      <StatCard
        label="To Lose"
        value={`${tolose} kg`}
        sub="remaining to target"
        color="#8b5cf6"
        icon={TrendingDown}
        delay={0.1}
      />
      <StatCard
        label="Calories"
        value={`${calories}`}
        sub="today's intake"
        color="#f59e0b"
        icon={Flame}
        delay={0.2}
      />
      <StatCard
        label="Steps"
        value={steps.toLocaleString()}
        sub="today's steps"
        color="#06b6d4"
        icon={Footprints}
        delay={0.3}
      />
    </div>
  );
}
