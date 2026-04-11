"use client";

import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "@/components/planner/TaskItem";
import { CheckCircle2 } from "lucide-react";
import type { Task } from "@/types";

// ─── Props ────────────────────────────────────────────────────────────────────
interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  filter: "all" | "pending" | "completed";
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ filter }: { filter: string }) {
  const messages = {
    all: {
      title: "No tasks yet",
      sub: "Add your first task for the day",
    },
    pending: {
      title: "No pending tasks",
      sub: "You're all caught up! 🎉",
    },
    completed: {
      title: "No completed tasks",
      sub: "Start checking things off",
    },
  };

  const msg = messages[filter as keyof typeof messages] || messages.all;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 gap-3"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: "var(--muted)" }}
      >
        <CheckCircle2 size={22} style={{ color: "var(--muted-foreground)" }} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {msg.title}
        </p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {msg.sub}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  filter,
}: TaskListProps) {
  // Filter tasks
  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.isDone;
    if (filter === "completed") return t.isDone;
    return true;
  });

  // Sort — pending first, then completed
  const sorted = [...filtered].sort((a, b) => {
    if (a.isDone === b.isDone) return 0;
    return a.isDone ? 1 : -1;
  });

  // Group by priority for "all" view
  const high = sorted.filter((t) => t.priority === "high" && !t.isDone);
  const medium = sorted.filter((t) => t.priority === "medium" && !t.isDone);
  const low = sorted.filter((t) => t.priority === "low" && !t.isDone);
  const done = sorted.filter((t) => t.isDone);

  if (filtered.length === 0) {
    return <EmptyState filter={filter} />;
  }

  // Flat view for pending/completed filters
  if (filter !== "all") {
    return (
      <motion.div layout className="flex flex-col gap-2">
        <AnimatePresence>
          {sorted.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Grouped view for "all" filter
  return (
    <motion.div layout className="flex flex-col gap-6">
      {/* High priority */}
      {high.length > 0 && (
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#f43f5e" }}
          >
            High Priority
          </span>
          <AnimatePresence>
            {high.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Medium priority */}
      {medium.length > 0 && (
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#f59e0b" }}
          >
            Medium Priority
          </span>
          <AnimatePresence>
            {medium.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Low priority */}
      {low.length > 0 && (
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#10b981" }}
          >
            Low Priority
          </span>
          <AnimatePresence>
            {low.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            Completed ({done.length})
          </span>
          <AnimatePresence>
            {done.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
