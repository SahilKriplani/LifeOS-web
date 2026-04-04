"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number; // px size of the ring
  strokeWidth?: number; // thickness of the ring
  label?: string; // center label (e.g. "Goals")
  showPercent?: boolean; // show % in center
  className?: string;
  color?: string; // custom stroke color
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  showPercent = true,
  className,
  color,
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  // ─── SVG circle math ────────────────────────────────────────────────────────
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90" // start from top
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color || "var(--primary)"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercent && (
          <motion.span
            key={clampedValue}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-lg font-bold leading-none"
            style={{ color: "var(--foreground)" }}
          >
            {clampedValue}%
          </motion.span>
        )}
        {label && (
          <span
            className="text-xs mt-1 font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
