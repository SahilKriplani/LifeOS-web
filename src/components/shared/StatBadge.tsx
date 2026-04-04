"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatBadgeProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

// ─── Trend color map ──────────────────────────────────────────────────────────
const trendColorMap = {
  up: "text-emerald-400",
  down: "text-rose-400",
  neutral: "text-muted-foreground",
};

const trendSymbol = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function StatBadge({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("glass rounded-xl p-4 flex flex-col gap-3", className)}
    >
      {/* Top row — label + icon */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "var(--muted)" }}
        >
          <Icon size={15} style={{ color: "var(--accent)" }} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <motion.span
          key={String(value)}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {value}
        </motion.span>

        {/* Trend badge */}
        {trend && trendValue && (
          <span
            className={cn(
              "text-xs font-medium flex items-center gap-0.5",
              trendColorMap[trend],
            )}
          >
            {trendSymbol[trend]} {trendValue}
          </span>
        )}
      </div>
    </motion.div>
  );
}
