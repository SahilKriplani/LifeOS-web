"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsRow from "@/components/dashboard/StatsRow";
import ChartsSection from "@/components/dashboard/ChartsSection";
import PlannerWidget from "@/components/dashboard/PlannerWidget";
import StreakCalendar from "@/components/dashboard/StreakCalendar";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <DashboardHeader name="Sahil" streak={21} />

      {/* Stats row */}
      <StatsRow
        dsaSolved={142}
        currentStreak={21}
        currentWeight={134}
        dailyCompletion={80}
      />

      {/* Charts */}
      <ChartsSection />

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlannerWidget />
        <StreakCalendar currentStreak={21} bestStreak={21} />
      </div>
    </div>
  );
}
