"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Trash2, CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import ProgressRing from "@/components/shared/ProgressRing";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGoals,
  useCreateGoal,
  useDeleteGoal,
  type Goal,
  type CreateGoalPayload,
} from "@/hooks/useGoals";
import toast from "react-hot-toast";

// ─── Category config ──────────────────────────────────────────────────────────
const categoryConfig = {
  dsa: { label: "DSA", color: "#14B8A6", bg: "rgba(20,184,166,0.1)" },
  fitness: { label: "Fitness", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  career: { label: "Career", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  personal: { label: "Personal", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
};

type FilterType = "all" | "dsa" | "fitness" | "career" | "personal";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function GoalSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-52 rounded-2xl animate-pulse"
          style={{ background: "var(--muted)" }}
        />
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "var(--muted)" }}
      >
        <Target size={24} style={{ color: "var(--muted-foreground)" }} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          No goals yet
        </p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Add your first goal to start tracking
        </p>
      </div>
      <Button
        onClick={onAdd}
        className="mt-2"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        <Plus size={14} className="mr-1" />
        Add First Goal
      </Button>
    </motion.div>
  );
}

// ─── Goal card ────────────────────────────────────────────────────────────────
function GoalCard({
  goal,
  onDelete,
}: {
  goal: Goal;
  onDelete: (id: number) => void;
}) {
  const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
  const isComplete = percent >= 100;
  const cat = categoryConfig[goal.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4 group"
      style={{
        background: "var(--muted)",
        border: "1px solid var(--glass-border)",
      }}
    >
      {isComplete && (
        <BorderBeam
          size={200}
          duration={6}
          colorFrom={goal.color}
          colorTo="#fff"
        />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              className="text-xs font-medium border-0 shrink-0"
              style={{ background: cat.bg, color: cat.color }}
            >
              {cat.label}
            </Badge>
            {isComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              </motion.div>
            )}
          </div>
          <h3
            className="text-sm font-semibold leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {goal.title}
          </h3>
          {goal.description && (
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {goal.description}
            </p>
          )}
        </div>

        <ProgressRing
          value={percent}
          color={goal.color}
          size={72}
          strokeWidth={6}
          showPercent
        />
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--muted-foreground)" }}>
            {goal.current} / {goal.target} {goal.unit}
          </span>
          <span style={{ color: goal.color }} className="font-semibold">
            {percent}%
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--glass-border)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: goal.color }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Deadline: {goal.deadline}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(goal.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e" }}
        >
          <Trash2 size={12} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Add goal modal ───────────────────────────────────────────────────────────
function AddGoalModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (goal: CreateGoalPayload) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    current: "0",
    unit: "",
    color: "#14B8A6",
    category: "personal" as Goal["category"],
    deadline: "",
  });

  const handleSubmit = () => {
    if (!form.title || !form.target || !form.unit || !form.deadline) {
      toast.error("Please fill all required fields");
      return;
    }
    onSubmit({
      ...form,
      target: Number(form.target),
      current: Number(form.current),
    });
  };

  const handleClose = () => {
    setForm({
      title: "",
      description: "",
      target: "",
      current: "0",
      unit: "",
      color: "#14B8A6",
      category: "personal",
      deadline: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="relative border-0 p-0 max-w-lg w-full"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          border: "1px solid var(--glass-border)",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <BorderBeam
          size={300}
          duration={8}
          colorFrom="var(--primary)"
          colorTo="var(--accent)"
        />
        <div className="p-6 flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle
              className="text-lg font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Add New Goal
            </DialogTitle>
            <DialogDescription style={{ color: "var(--muted-foreground)" }}>
              Set a new goal to track your progress
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Goal Title *
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Solve 300 DSA Problems"
                autoFocus
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Description
              </Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Brief description of this goal"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            {/* Target + Current + Unit */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Target *
                </Label>
                <Input
                  type="number"
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  placeholder="300"
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Current
                </Label>
                <Input
                  type="number"
                  value={form.current}
                  onChange={(e) =>
                    setForm({ ...form, current: e.target.value })
                  }
                  placeholder="0"
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Unit *
                </Label>
                <Input
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="problems"
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Category
              </Label>
              <div
                className="flex gap-1 p-1 rounded-xl"
                style={{ background: "var(--muted)" }}
              >
                {(Object.keys(categoryConfig) as Goal["category"][]).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
                      style={
                        form.category === cat
                          ? {
                              background: categoryConfig[cat].color,
                              color: "#fff",
                            }
                          : { color: "var(--muted-foreground)" }
                      }
                    >
                      {cat}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Deadline *
              </Label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            {/* Color picker */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Color
              </Label>
              <div className="flex gap-2 flex-wrap">
                {[
                  "#14B8A6",
                  "#8b5cf6",
                  "#f59e0b",
                  "#f97316",
                  "#06b6d4",
                  "#ec4899",
                  "#f43f5e",
                  "#10b981",
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    className="w-7 h-7 rounded-full transition-all duration-200"
                    style={{
                      background: c,
                      outline: form.color === c ? `2px solid ${c}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "1px solid var(--glass-border)",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {isLoading ? "Adding..." : "Add Goal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GoalsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  // ─── Queries ────────────────────────────────────────────────────────────────
  const { data: goals = [], isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const deleteGoal = useDeleteGoal();

  // ─── Derived ────────────────────────────────────────────────────────────────
  const filtered =
    filter === "all" ? goals : goals.filter((g) => g.category === filter);

  const overallPercent =
    goals.length === 0
      ? 0
      : Math.round(
          goals.reduce(
            (sum, g) => sum + Math.min((g.current / g.target) * 100, 100),
            0,
          ) / goals.length,
        );

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleAdd = (payload: CreateGoalPayload) => {
    createGoal.mutate(payload, {
      onSuccess: () => {
        toast.success("Goal added! 🎯");
        setModalOpen(false);
      },
      onError: () => toast.error("Failed to add goal"),
    });
  };

  const handleDelete = (id: number) => {
    deleteGoal.mutate(id, {
      onSuccess: () => toast.success("Goal removed"),
      onError: () => toast.error("Failed to delete goal"),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Target size={20} style={{ color: "var(--primary)" }} />
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Goals
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {goals.length} active goals — {overallPercent}% overall completion
          </p>
        </div>
        <ShimmerButton
          onClick={() => setModalOpen(true)}
          shimmerColor="var(--accent)"
          background="var(--primary)"
          className="h-10 px-5 text-sm font-semibold rounded-xl"
        >
          <Plus size={15} className="mr-1" />
          Add Goal
        </ShimmerButton>
      </motion.div>

      {/* Overall progress */}
      {!isLoading && goals.length > 0 && (
        <GlassCard padding="md">
          <div className="flex items-center gap-6 flex-wrap">
            <ProgressRing
              value={overallPercent}
              color="var(--primary)"
              size={100}
              strokeWidth={8}
              label="Overall"
              showPercent
            />
            <div className="flex flex-col gap-3 flex-1">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Overall Goal Completion
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(categoryConfig) as Goal["category"][]).map(
                  (cat) => {
                    const catGoals = goals.filter((g) => g.category === cat);
                    const catPercent =
                      catGoals.length === 0
                        ? 0
                        : Math.round(
                            catGoals.reduce(
                              (sum, g) =>
                                sum +
                                Math.min((g.current / g.target) * 100, 100),
                              0,
                            ) / catGoals.length,
                          );
                    return (
                      <div
                        key={cat}
                        className="flex flex-col gap-1 px-3 py-2 rounded-lg"
                        style={{ background: "var(--muted)" }}
                      >
                        <span
                          className="text-xs capitalize font-medium"
                          style={{ color: categoryConfig[cat].color }}
                        >
                          {cat}
                        </span>
                        <span
                          className="text-lg font-bold"
                          style={{ color: "var(--foreground)" }}
                        >
                          {catPercent}%
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Filter tabs */}
      {!isLoading && goals.length > 0 && (
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: "var(--muted)" }}
        >
          {(
            ["all", "dsa", "fitness", "career", "personal"] as FilterType[]
          ).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
              style={
                filter === f
                  ? {
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }
                  : { color: "var(--muted-foreground)" }
              }
            >
              {f}
            </motion.button>
          ))}
        </div>
      )}

      {/* Goals grid */}
      {isLoading ? (
        <GoalSkeleton />
      ) : goals.length === 0 ? (
        <EmptyState onAdd={() => setModalOpen(true)} />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filtered.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AddGoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        isLoading={createGoal.isPending}
      />
    </div>
  );
}
