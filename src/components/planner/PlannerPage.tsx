"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlannerHeader from "@/components/planner/PlannerHeader";
import TaskList from "@/components/planner/TaskList";
import AddTaskModal from "@/components/planner/AddTaskModal";
import GlassCard from "@/components/shared/GlassCard";
import { getTodayISO } from "@/lib/utils";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import type { Task, CreateTaskPayload } from "@/types";
import toast from "react-hot-toast";

// ─── Filter type ──────────────────────────────────────────────────────────────
type FilterType = "all" | "pending" | "completed";

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function TaskSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-xl animate-pulse"
          style={{ background: "var(--muted)" }}
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [filter, setFilter] = useState<FilterType>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // ─── Queries ────────────────────────────────────────────────────────────────
  const { data: tasks = [], isLoading } = useTasks(selectedDate);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask(selectedDate);
  const deleteTask = useDeleteTask(selectedDate);

  // ─── Derived ────────────────────────────────────────────────────────────────
  const completed = tasks.filter((t) => t.isDone).length;

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleAddTask = async (payload: CreateTaskPayload) => {
    if (editTask) {
      updateTask.mutate(
        {
          id: editTask.id,
          payload: {
            title: payload.title,
            priority: payload.priority,
          },
        },
        {
          onSuccess: () => {
            toast.success("Task updated");
            setEditTask(null);
          },
          onError: () => toast.error("Failed to update task"),
        },
      );
    } else {
      createTask.mutate(payload, {
        onSuccess: () => toast.success("Task added"),
        onError: () => toast.error("Failed to add task"),
      });
    }
  };

  const handleToggle = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask.mutate(
      { id, payload: { isDone: !task.isDone } },
      { onError: () => toast.error("Failed to update task") },
    );
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteTask.mutate(id, {
      onSuccess: () => toast.success("Task deleted"),
      onError: () => toast.error("Failed to delete task"),
    });
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
        totalTasks={tasks.length}
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
                ? tasks.length
                : f.value === "pending"
                  ? tasks.filter((t) => !t.isDone).length
                  : tasks.filter((t) => t.isDone).length;

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
        {isLoading ? (
          <TaskSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedDate}-${filter}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TaskList
                tasks={tasks}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                filter={filter}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </GlassCard>

      {/* Modal */}
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
