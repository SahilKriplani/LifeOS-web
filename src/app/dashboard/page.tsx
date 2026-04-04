"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader name="Sahil" streak={7} />

      {/* Skeleton placeholders — replaced next */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl animate-pulse"
            style={{ background: "var(--muted)" }}
          />
        ))}
      </div>
    </div>
  );
}
