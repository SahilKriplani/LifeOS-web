"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import PlannerHeader from "@/components/planner/PlannerHeader";
import TaskList from "@/components/planner/TaskList";
import AddTaskModal from "@/components/planner/AddTaskModal";
import GlassCard from "@/components/shared/GlassCard";
import { getTodayISO } from "@/lib/utils";
import type { Task, CreateTaskPayload } from "@/types";
import toast from "react-hot-toast";

// ─── Filter type ──────────────────────────────────────────────────────────────
type FilterType = "all" | "pending" | "completed";

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockTasks: Task[] = [
  {
    id: 1,
    userId: 1,
    title: "Solve 3 LeetCode problems",
    isDone: true,
    scheduledDate: getTodayISO(),
    priority: "high",
    createdAt: "",
  },
  {
    id: 2,
    userId: 1,
    title: "Morning workout — 45 mins",
    isDone: true,
    scheduledDate: getTodayISO(),
    priority: "high",
    createdAt: "",
  },
  {
    id: 3,
    userId: 1,
    title: "Read system design chapter",
    isDone: false,
    scheduledDate: getTodayISO(),
    priority: "medium",
    createdAt: "",
  },
  {
    id: 4,
    userId: 1,
    title: "Log today's weight and calories",
    isDone: false,
    scheduledDate: getTodayISO(),
    priority: "medium",
    createdAt: "",
  },
  {
    id: 5,
    userId: 1,
    title: "Review DSA notes",
    isDone: false,
    scheduledDate: getTodayISO(),
    priority: "low",
    createdAt: "",
  },
];

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [filter, setFilter] = useState<FilterType>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // ─── Derived values ──────────────────────────────────────────────────────────
  const todayTasks = tasks.filter((t) => t.scheduledDate === selectedDate);
  const completed = todayTasks.filter((t) => t.isDone).length;

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleAddTask = (payload: CreateTaskPayload) => {
    if (editTask) {
      // Edit mode
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editTask.id
            ? { ...t, title: payload.title, priority: payload.priority }
            : t,
        ),
      );
      toast.success("Task updated");
      setEditTask(null);
    } else {
      // Add mode
      const newTask: Task = {
        id: Date.now(),
        userId: 1,
        title: payload.title,
        isDone: false,
        scheduledDate: payload.scheduledDate,
        priority: payload.priority,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
      toast.success("Task added");
    }
  };

  const handleToggle = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t)),
    );
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task deleted");
  };

  const handleOpenAdd = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PlannerHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        totalTasks={todayTasks.length}
        completedTasks={completed}
        onAddTask={handleOpenAdd}
      />

      {/* Main content */}
      <GlassCard padding="md" className="flex flex-col gap-5">
        {/* Filter tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl w-fit"
          style={{ background: "var(--muted)" }}
        >
          {filters.map((f) => {
            const count =
              f.value === "all"
                ? todayTasks.length
                : f.value === "pending"
                  ? todayTasks.filter((t) => !t.isDone).length
                  : todayTasks.filter((t) => t.isDone).length;

            return (
              <motion.button
                key={f.value}
                onClick={() => setFilter(f.value)}
                whileTap={{ scale: 0.95 }}
                className="relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                style={
                  filter === f.value
                    ? {
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {f.label}
                {/* Count badge */}
                <span
                  className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background:
                      filter === f.value
                        ? "rgba(255,255,255,0.2)"
                        : "var(--glass-border)",
                    color:
                      filter === f.value
                        ? "var(--primary-foreground)"
                        : "var(--muted-foreground)",
                  }}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Task list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedDate}-${filter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <TaskList
              tasks={todayTasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              filter={filter}
            />
          </motion.div>
        </AnimatePresence>
      </GlassCard>

      {/* Add/Edit modal */}
      <AddTaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTask(null);
        }}
        onSubmit={handleAddTask}
        editTask={editTask}
        selectedDate={selectedDate}
      />
    </div>
  );
}
