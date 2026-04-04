"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean; // enable hover lift effect
  strong?: boolean; // stronger blur variant
  padding?: "none" | "sm" | "md" | "lg";
}

// ─── Padding map ──────────────────────────────────────────────────────────────
const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function GlassCard({
  children,
  className,
  hover = false,
  strong = false,
  padding = "md",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={hover ? { y: -3, scale: 1.01 } : undefined}
      className={cn(
        // Base glass styles
        strong ? "glass-strong" : "glass",
        "rounded-xl",
        paddingMap[padding],
        // Smooth transition for hover
        hover && "transition-shadow duration-300 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
