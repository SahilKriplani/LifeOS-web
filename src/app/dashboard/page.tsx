"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsRow from "@/components/dashboard/StatsRow";
import ChartsSection from "@/components/dashboard/ChartsSection";
import PlannerWidget from "@/components/dashboard/PlannerWidget";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import { useDSAStats } from "@/hooks/useDSA";
import { useFitnessStats } from "@/hooks/useFitness";

import { useTasks } from "@/hooks/useTasks";
import { getTodayISO } from "@/lib/utils";
import { useEffect } from "react";
import useUserStore from "@/store/useUserStore";
import { useCheckin, useStreak } from "@/hooks/useStreaks";

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const today = getTodayISO();

  // ─── Queries ────────────────────────────────────────────────────────────────
  const { data: dsaStats } = useDSAStats();
  const { data: fitnessStats } = useFitnessStats();
  const { data: streak } = useStreak();
  const { data: tasks = [] } = useTasks(today);
  const checkin = useCheckin();

  // ─── Auto checkin on dashboard load ─────────────────────────────────────────
  useEffect(() => {
    checkin.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Derived values ──────────────────────────────────────────────────────────
  const completedTasks = tasks.filter((t) => t.isDone).length;
  const totalTasks = tasks.length;
  const dailyCompletion =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <DashboardHeader
        name={user?.name ?? "Sahil"}
        streak={streak?.currentStreak ?? 0}
      />

      {/* Stats row */}
      <StatsRow
        dsaSolved={dsaStats?.total ?? 0}
        currentStreak={streak?.currentStreak ?? 0}
        currentWeight={Number(fitnessStats?.currentWeight ?? 0)}
        dailyCompletion={dailyCompletion}
      />

      {/* Charts */}
      <ChartsSection />

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlannerWidget />
        <StreakCalendar
          currentStreak={streak?.currentStreak ?? 0}
          bestStreak={streak?.bestStreak ?? 0}
        />
      </div>
    </div>
  );
}
