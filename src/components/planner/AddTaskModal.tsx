"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateTaskPayload, Task } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  title: yup
    .string()
    .min(2, "Minimum 2 characters")
    .required("Title is required"),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high"])
    .required("Priority is required"),
});

type FormData = yup.InferType<typeof schema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => void;
  editTask?: Task | null;
  selectedDate: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AddTaskModal({
  open,
  onClose,
  onSubmit,
  editTask,
  selectedDate,
}: AddTaskModalProps) {
  const isEdit = !!editTask;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { priority: "medium" },
  });
  const [priorityValue, setPriorityValue] = useState<"low" | "medium" | "high">(
    "medium",
  );
  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setValue("title", editTask.title);
      setValue("priority", editTask.priority);
      const timer = setTimeout(() => setPriorityValue(editTask.priority), 0);
      return () => clearTimeout(timer);
    } else {
      reset({ title: "", priority: "medium" });
      const timer = setTimeout(() => setPriorityValue("medium"), 0);
      return () => clearTimeout(timer);
    }
  }, [editTask, setValue, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      title: data.title,
      priority: data.priority as "low" | "medium" | "high",
      scheduledDate: selectedDate,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="relative overflow-hidden border-0 p-0 max-w-md"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {/* Border beam effect */}
        <BorderBeam
          size={250}
          duration={8}
          colorFrom="var(--primary)"
          colorTo="var(--accent)"
        />

        <div className="p-6 flex flex-col gap-6">
          {/* Header */}
          <DialogHeader>
            <DialogTitle
              className="text-lg font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {isEdit ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogDescription
              className="text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              {isEdit
                ? "Update your task details below"
                : `Adding task for ${selectedDate}`}
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Task Title
              </Label>
              <Input
                {...register("title")}
                placeholder="e.g. Solve 3 LeetCode problems"
                autoFocus
                style={{
                  background: "var(--muted)",
                  border: `1px solid ${errors.title ? "#f43f5e" : "var(--glass-border)"}`,
                  color: "var(--foreground)",
                }}
              />
              {errors.title && (
                <span className="text-xs text-rose-400">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Priority
              </Label>
              <Select
                value={priorityValue}
                onValueChange={(val) => {
                  const v = val as "low" | "medium" | "high";
                  setValue("priority", v);
                  setPriorityValue(v);
                }}
              >
                <SelectTrigger
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--foreground)",
                  }}
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  {["low", "medium", "high"].map((p) => (
                    <SelectItem
                      key={p}
                      value={p}
                      className="capitalize cursor-pointer"
                      style={{ color: "var(--foreground)" }}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={onClose}
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
                type="submit"
                disabled={isSubmitting}
                className="flex-1 font-semibold"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="animate-spin mr-2" />
                ) : null}
                {isEdit ? "Save Changes" : "Add Task"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
