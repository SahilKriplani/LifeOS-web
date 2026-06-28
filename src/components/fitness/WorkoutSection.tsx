"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/shared/GlassCard";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import WorkoutLogModal from "@/components/fitness/WorkoutLogModal";
import { Dumbbell, Trash2 } from "lucide-react";
import { useWorkouts, useDeleteWorkout } from "@/hooks/useWorkouts";
import { useWeightUnit } from "@/hooks/useWeightUnit";
import { formatWeight } from "@/lib/units";
import type { WeightUnit, WorkoutSet } from "@/types";
import toast from "react-hot-toast";

function SetSummary({ sets, unit }: { sets: WorkoutSet[]; unit: WeightUnit }) {
  return (
    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
      {sets
        .map((s) =>
          s.weightKg !== null
            ? `${formatWeight(s.weightKg, unit)} × ${s.reps}`
            : `${s.reps} reps`,
        )
        .join(",  ")}
    </span>
  );
}

export default function WorkoutSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [unit, setUnit] = useWeightUnit();

  const { data: sessions = [], isLoading } = useWorkouts();
  const deleteWorkout = useDeleteWorkout();

  const handleDelete = (id: number) => {
    deleteWorkout.mutate(id, {
      onSuccess: () => toast.success("Workout deleted"),
      onError: () => toast.error("Failed to delete workout"),
    });
  };

  return (
    <GlassCard padding="md" className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Dumbbell size={16} style={{ color: "var(--primary)" }} />
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Workout Log
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Display unit toggle */}
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{ background: "var(--muted)" }}
          >
            {(["kg", "lb"] as WeightUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase transition-all"
                style={
                  unit === u
                    ? {
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {u}
              </button>
            ))}
          </div>

          <ShimmerButton
            onClick={() => setModalOpen(true)}
            shimmerColor="var(--accent)"
            background="var(--primary)"
            className="h-9 px-4 text-xs font-semibold rounded-xl"
          >
            + Log Workout
          </ShimmerButton>
        </div>
      </div>

      {/* Sessions */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl animate-pulse"
              style={{ background: "var(--muted)" }}
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <Dumbbell size={22} style={{ color: "var(--muted-foreground)" }} />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            No workouts logged yet — hit the gym 💪
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="group rounded-xl p-3.5 flex flex-col gap-3"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
              }}
            >
              {/* Session header */}
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--primary)" }}
                >
                  {session.logDate}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(session.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e" }}
                >
                  <Trash2 size={11} />
                </button>
              </div>

              {/* Exercises */}
              <div className="flex flex-col gap-2">
                {session.exercises.map((ex) => (
                  <div
                    key={ex.exerciseId}
                    className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--foreground)" }}
                      >
                        {ex.exerciseName}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {ex.sets.length}×
                      </span>
                    </div>
                    <SetSummary sets={ex.sets} unit={unit} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <WorkoutLogModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </GlassCard>
  );
}
