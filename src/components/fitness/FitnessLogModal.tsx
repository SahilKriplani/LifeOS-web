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
import type { CreateFitnessLogPayload } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  weightKg: yup
    .number()
    .min(30, "Must be at least 30kg")
    .max(300, "Must be under 300kg")
    .required("Weight is required"),
  calories: yup
    .number()
    .min(0, "Cannot be negative")
    .required("Calories is required"),
  steps: yup
    .number()
    .min(0, "Cannot be negative")
    .required("Steps is required"),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

interface FitnessLogModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateFitnessLogPayload) => void;
}

export default function FitnessLogModal({
  open,
  onClose,
  onSubmit,
}: FitnessLogModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: { weightKg: 134, calories: 0, steps: 0 },
  });

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => reset(), 0);
      return () => clearTimeout(timer);
    }
  }, [open, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      logDate: new Date().toISOString().split("T")[0],
      weightKg: data.weightKg,
      calories: data.calories,
      steps: data.steps,
      notes: data.notes || "",
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
        <BorderBeam
          size={250}
          duration={8}
          colorFrom="var(--primary)"
          colorTo="#8b5cf6"
        />
        <div className="p-6 flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle
              className="text-lg font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Log Today&apos;s Fitness
            </DialogTitle>
            <DialogDescription
              className="text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Track your weight, calories and steps
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Weight */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Weight (kg)
              </Label>
              <Input
                {...register("weightKg")}
                type="number"
                step="0.1"
                placeholder="134.0"
                autoFocus
                style={{
                  background: "var(--muted)",
                  border: `1px solid ${errors.weightKg ? "#f43f5e" : "var(--glass-border)"}`,
                  color: "var(--foreground)",
                }}
              />
              {errors.weightKg && (
                <span className="text-xs text-rose-400">
                  {errors.weightKg.message}
                </span>
              )}
            </div>

            {/* Calories + Steps row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Calories
                </Label>
                <Input
                  {...register("calories")}
                  type="number"
                  placeholder="2000"
                  style={{
                    background: "var(--muted)",
                    border: `1px solid ${errors.calories ? "#f43f5e" : "var(--glass-border)"}`,
                    color: "var(--foreground)",
                  }}
                />
                {errors.calories && (
                  <span className="text-xs text-rose-400">
                    {errors.calories.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Steps
                </Label>
                <Input
                  {...register("steps")}
                  type="number"
                  placeholder="8000"
                  style={{
                    background: "var(--muted)",
                    border: `1px solid ${errors.steps ? "#f43f5e" : "var(--glass-border)"}`,
                    color: "var(--foreground)",
                  }}
                />
                {errors.steps && (
                  <span className="text-xs text-rose-400">
                    {errors.steps.message}
                  </span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Notes (optional)
              </Label>
              <Input
                {...register("notes")}
                placeholder="e.g. Felt great today, skipped dinner"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--foreground)",
                }}
              />
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
                Save Log
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
