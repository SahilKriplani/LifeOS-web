"use client";

import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/shared/GlassCard";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import { useState } from "react";
import { cn, priorityColor } from "@/lib/utils";
import type { Task } from "@/types";

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockTasks: Task[] = [
  {
    id: 1,
    userId: 1,
    title: "Solve 3 LeetCode problems",
    isDone: true,
    scheduledDate: "2025-04-05",
    priority: "high",
    createdAt: "",
  },
  {
    id: 2,
    userId: 1,
    title: "Morning workout — 45 mins",
    isDone: true,
    scheduledDate: "2025-04-05",
    priority: "high",
    createdAt: "",
  },
  {
    id: 3,
    userId: 1,
    title: "Read system design chapter",
    isDone: false,
    scheduledDate: "2025-04-05",
    priority: "medium",
    createdAt: "",
  },
  {
    id: 4,
    userId: 1,
    title: "Log today's weight and calories",
    isDone: false,
    scheduledDate: "2025-04-05",
    priority: "medium",
    createdAt: "",
  },
  {
    id: 5,
    userId: 1,
    title: "Review DSA notes",
    isDone: false,
    scheduledDate: "2025-04-05",
    priority: "low",
    createdAt: "",
  },
];

// ─── Task item component ──────────────────────────────────────────────────────
function TaskItem({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-2.5 px-3 rounded-lg group cursor-pointer transition-colors duration-200"
      style={{ background: "var(--muted)" }}
      onClick={() => onToggle(task.id)}
    >
      {/* Checkbox */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="shrink-0"
      >
        {task.isDone ? (
          <CheckCircle2 size={18} style={{ color: "var(--primary)" }} />
        ) : (
          <Circle size={18} style={{ color: "var(--muted-foreground)" }} />
        )}
      </motion.div>

      {/* Title */}
      <span
        className={cn(
          "text-sm flex-1 transition-all duration-200",
          task.isDone && "line-through opacity-50",
        )}
        style={{ color: "var(--foreground)" }}
      >
        {task.title}
      </span>

      {/* Priority dot */}
      <span
        className={cn(
          "text-xs font-semibold capitalize shrink-0",
          priorityColor[task.priority],
        )}
      >
        {task.priority}
      </span>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PlannerWidget() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);

  const completed = tasks.filter((t) => t.isDone).length;
  const total = tasks.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleToggle = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t)),
    );
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now(),
      userId: 1,
      title: newTask.trim(),
      isDone: false,
      scheduledDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      createdAt: "",
    };
    setTasks((prev) => [...prev, task]);
    setNewTask("");
    setShowInput(false);
  };

  return (
    <GlassCard padding="md" className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Today&apos;s Planner
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            {completed} of {total} completed
          </p>
        </div>

        {/* Add task button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInput(!showInput)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          <Plus size={14} />
        </motion.button>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--muted)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "var(--primary)" }}
          />
        </div>
        <div className="flex justify-between">
          <span
            className="text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            Daily progress
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--primary)" }}
          >
            {percent}%
          </span>
        </div>
      </div>

      {/* Add task input */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 overflow-hidden"
          >
            <input
              autoFocus
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Add a task... (press Enter)"
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
                color: "var(--foreground)",
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddTask}
              className="px-3 py-2 rounded-lg text-xs font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Add
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task list */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
