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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatBadge
        label="DSA Solved"
        value={dsaSolved}
        icon={Code2}
        trend="up"
        trendValue="3 today"
      />
      <StatBadge
        label="Current Streak"
        value={`${currentStreak} days`}
        icon={Flame}
        trend="up"
        trendValue="best: 21"
      />
      <StatBadge
        label="Weight"
        value={`${currentWeight} kg`}
        icon={Scale}
        trend="down"
        trendValue="−0.5 kg"
      />
      <StatBadge
        label="Daily Tasks"
        value={`${dailyCompletion}%`}
        icon={CheckCircle2}
        trend="up"
        trendValue="8/10 done"
      />
    </div>
  );
}
