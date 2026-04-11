"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import type { CreateDSALogPayload } from "@/types";

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  problemName: yup
    .string()
    .min(2, "Minimum 2 characters")
    .required("Problem name is required"),
  topic: yup.string().required("Topic is required"),
  platform: yup
    .string()
    .oneOf(["leetcode", "codeforces", "gfg", "other"])
    .required("Platform is required"),
  difficulty: yup
    .string()
    .oneOf(["easy", "medium", "hard"])
    .required("Difficulty is required"),
});

type FormData = yup.InferType<typeof schema>;

// ─── Topics list ──────────────────────────────────────────────────────────────
const topics = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Queue",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion",
  "Binary Search",
  "Sorting",
  "Hashing",
  "Greedy",
  "Backtracking",
  "Trie",
  "Heap",
  "Math",
  "Other",
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface DSALogModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateDSALogPayload) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DSALogModal({
  open,
  onClose,
  onSubmit,
}: DSALogModalProps) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [platform, setPlatform] = useState<
    "leetcode" | "codeforces" | "gfg" | "other"
  >("leetcode");
  const [topic, setTopic] = useState("Arrays");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      platform: "leetcode",
      difficulty: "medium",
      topic: "Arrays",
    },
  });

  // Sync local state with form
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue("difficulty", difficulty);
      setValue("platform", platform);
      setValue("topic", topic);
    }, 0);
    return () => clearTimeout(timer);
  }, [difficulty, platform, topic, setValue]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        reset();
        setDifficulty("medium");
        setPlatform("leetcode");
        setTopic("Arrays");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      problemName: data.problemName,
      topic: data.topic,
      platform: data.platform as "leetcode" | "codeforces" | "gfg" | "other",
      difficulty: data.difficulty as "easy" | "medium" | "hard",
      solvedAt: new Date().toISOString().split("T")[0],
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="relative overflow-hidden border-0 p-0 max-w-lg"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <BorderBeam
          size={300}
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
              Log a Problem
            </DialogTitle>
            <DialogDescription
              className="text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Record a solved DSA problem to track your progress
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Problem name */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Problem Name
              </Label>
              <Input
                {...register("problemName")}
                placeholder="e.g. Two Sum"
                autoFocus
                style={{
                  background: "var(--muted)",
                  border: `1px solid ${errors.problemName ? "#f43f5e" : "var(--glass-border)"}`,
                  color: "var(--foreground)",
                }}
              />
              {errors.problemName && (
                <span className="text-xs text-rose-400">
                  {errors.problemName.message}
                </span>
              )}
            </div>

            {/* Topic + Platform row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Topic */}
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Topic
                </Label>
                <Select value={topic} onValueChange={(val) => setTopic(val)}>
                  <SelectTrigger
                    style={{
                      background: "var(--muted)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--glass-bg)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    {topics.map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="cursor-pointer"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform */}
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Platform
                </Label>
                <Select
                  value={platform}
                  onValueChange={(val) =>
                    setPlatform(
                      val as "leetcode" | "codeforces" | "gfg" | "other",
                    )
                  }
                >
                  <SelectTrigger
                    style={{
                      background: "var(--muted)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--glass-bg)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    {["leetcode", "codeforces", "gfg", "other"].map((p) => (
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
            </div>

            {/* Difficulty — visual toggle */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Difficulty
              </Label>
              <div
                className="flex gap-2 p-1 rounded-xl"
                style={{ background: "var(--muted)" }}
              >
                {(["easy", "medium", "hard"] as const).map((d) => {
                  const colors = {
                    easy: "#10b981",
                    medium: "#f59e0b",
                    hard: "#f43f5e",
                  };
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
                      style={
                        difficulty === d
                          ? {
                              background: `${colors[d]}20`,
                              color: colors[d],
                              border: `1px solid ${colors[d]}40`,
                            }
                          : {
                              color: "var(--muted-foreground)",
                            }
                      }
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
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
                Log Problem
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
