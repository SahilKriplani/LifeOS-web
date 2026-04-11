"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, priorityColor } from "@/lib/utils";
import type { Task } from "@/types";

// ─── Priority badge variant map ───────────────────────────────────────────────
const priorityBg: Record<string, string> = {
  low: "rgba(16,185,129,0.1)",
  medium: "rgba(245,158,11,0.1)",
  high: "rgba(244,63,94,0.1)",
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.005 }}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden"
      style={{
        background: "var(--muted)",
        border: "1px solid var(--glass-border)",
      }}
    >
      {/* Priority left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
        style={{ background: priorityBg[task.priority].replace("0.1", "0.8") }}
      />

      {/* Checkbox */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(task.id)}
        className="shrink-0"
      >
        {task.isDone ? (
          <CheckCircle2 size={20} style={{ color: "var(--primary)" }} />
        ) : (
          <Circle size={20} style={{ color: "var(--muted-foreground)" }} />
        )}
      </motion.button>

      {/* Title */}
      <span
        className={cn(
          "flex-1 text-sm transition-all duration-300",
          task.isDone && "line-through opacity-40",
        )}
        style={{ color: "var(--foreground)" }}
      >
        {task.title}
      </span>

      {/* Priority badge */}
      <Badge
        className="text-xs font-medium capitalize shrink-0 border-0"
        style={{
          background: priorityBg[task.priority],
          color: priorityColor[task.priority].replace("text-", ""),
        }}
      >
        {task.priority}
      </Badge>

      {/* Action buttons — show on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(task)}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "var(--glass-border)",
            color: "var(--muted-foreground)",
          }}
        >
          <Pencil size={12} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "rgba(244,63,94,0.1)",
            color: "#f43f5e",
          }}
        >
          <Trash2 size={12} />
        </motion.button>
      </div>
    </motion.div>
  );
}
