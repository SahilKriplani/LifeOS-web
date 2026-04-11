"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

// ─── Props ────────────────────────────────────────────────────────────────────
interface DSAHeaderProps {
  total: number;
  onLogProblem: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DSAHeader({ total, onLogProblem }: DSAHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between flex-wrap gap-4"
    >
      {/* Left */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Code2 size={20} style={{ color: "var(--primary)" }} />
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            DSA Tracker
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          {total} problems solved — target 300+
        </p>
      </div>

      {/* Right */}
      <ShimmerButton
        onClick={onLogProblem}
        shimmerColor="var(--accent)"
        background="var(--primary)"
        className="h-10 px-5 text-sm font-semibold rounded-xl"
      >
        + Log Problem
      </ShimmerButton>
    </motion.div>
  );
}
