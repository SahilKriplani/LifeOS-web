"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface DSAHeaderProps {
  total: number;
  onLogProblem: () => void;
}

export default function DSAHeader({ total, onLogProblem }: DSAHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between flex-wrap gap-3"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Code2 size={18} style={{ color: "var(--primary)" }} />
          <h1
            className="text-xl md:text-2xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            DSA Tracker
          </h1>
        </div>
        <p
          className="text-xs md:text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          {total} problems solved — target 300+
        </p>
      </div>
      <ShimmerButton
        onClick={onLogProblem}
        shimmerColor="var(--accent)"
        background="var(--primary)"
        className="h-9 md:h-10 px-4 md:px-5 text-xs md:text-sm font-semibold rounded-xl"
      >
        + Log Problem
      </ShimmerButton>
    </motion.div>
  );
}
