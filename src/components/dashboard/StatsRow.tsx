"use client";

import StatBadge from "@/components/shared/StatBadge";
import { Code2, Flame, Scale, CheckCircle2 } from "lucide-react";

interface StatsRowProps {
  dsaSolved: number;
  currentStreak: number;
  currentWeight: number;
  dailyCompletion: number;
}

export default function StatsRow({
  dsaSolved,
  currentStreak,
  currentWeight,
  dailyCompletion,
}: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
      <StatBadge
        label="DSA Solved"
        value={dsaSolved}
        icon={Code2}
        trend="up"
        trendValue="target 300"
      />
      <StatBadge
        label="Streak"
        value={`${currentStreak}d`}
        icon={Flame}
        trend="up"
        trendValue="keep going"
      />
      <StatBadge
        label="Weight"
        value={currentWeight > 0 ? `${currentWeight}kg` : "—"}
        icon={Scale}
        trend="down"
        trendValue="→ 85kg"
      />
      <StatBadge
        label="Daily Tasks"
        value={`${dailyCompletion}%`}
        icon={CheckCircle2}
        trend="up"
        trendValue="completion"
      />
    </div>
  );
}
