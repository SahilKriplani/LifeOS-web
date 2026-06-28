"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Trash2, Search, Dumbbell, Loader2 } from "lucide-react";
import {
  useExercises,
  useCreateExercise,
  useCreateWorkout,
} from "@/hooks/useWorkouts";
import { useWeightUnit } from "@/hooks/useWeightUnit";
import { toKg } from "@/lib/units";
import { MUSCLE_GROUPS } from "@/types";
import type { Exercise, MuscleGroup, WeightUnit } from "@/types";
import toast from "react-hot-toast";

// ─── Local editing types ────────────────────────────────────────────────────────
interface SetDraft {
  weight: string; // in the current display unit
  reps: string;
}
interface EntryDraft {
  exerciseId: number;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: SetDraft[];
}

interface WorkoutLogModalProps {
  open: boolean;
  onClose: () => void;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

// Convert a weight string from one unit to another (keeps the modal WYSIWYG on toggle).
function convertWeightStr(value: string, from: WeightUnit, to: WeightUnit) {
  if (!value.trim() || from === to) return value;
  const kg = toKg(parseFloat(value), from);
  if (kg === null) return value;
  const out = to === "kg" ? kg : kg / 0.45359237;
  const rounded = Math.round(out * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
}

export default function WorkoutLogModal({
  open,
  onClose,
}: WorkoutLogModalProps) {
  const [unit, setUnit] = useWeightUnit();
  const [logDate, setLogDate] = useState(todayStr());
  const [entries, setEntries] = useState<EntryDraft[]>([]);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data: exercises = [],
    isLoading: exercisesLoading,
    isError: exercisesError,
  } = useExercises();
  const createExercise = useCreateExercise();
  const createWorkout = useCreateWorkout();

  // Custom-exercise inline form
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customGroup, setCustomGroup] = useState<MuscleGroup>("chest");

  // ── Grouped + filtered exercise library for the picker ──
  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? exercises.filter((e) => e.name.toLowerCase().includes(q))
      : exercises;
    const map = new Map<MuscleGroup, Exercise[]>();
    for (const ex of filtered) {
      const list = map.get(ex.muscleGroup) ?? [];
      list.push(ex);
      map.set(ex.muscleGroup, list);
    }
    return MUSCLE_GROUPS.map((g) => ({ group: g, items: map.get(g) ?? [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [exercises, search]);

  // ── Mutators ──
  const addExercise = (ex: Exercise) => {
    setEntries((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: [{ weight: "", reps: "" }],
      },
    ]);
    setPickerOpen(false);
    setSearch("");
  };

  const removeEntry = (idx: number) =>
    setEntries((prev) => prev.filter((_, i) => i !== idx));

  const addSet = (entryIdx: number) =>
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIdx ? { ...e, sets: [...e.sets, { weight: "", reps: "" }] } : e,
      ),
    );

  const removeSet = (entryIdx: number, setIdx: number) =>
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIdx
          ? { ...e, sets: e.sets.filter((_, s) => s !== setIdx) }
          : e,
      ),
    );

  const updateSet = (
    entryIdx: number,
    setIdx: number,
    field: keyof SetDraft,
    value: string,
  ) =>
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIdx
          ? {
              ...e,
              sets: e.sets.map((s, si) =>
                si === setIdx ? { ...s, [field]: value } : s,
              ),
            }
          : e,
      ),
    );

  const handleUnitToggle = (next: WeightUnit) => {
    if (next === unit) return;
    setEntries((prev) =>
      prev.map((e) => ({
        ...e,
        sets: e.sets.map((s) => ({
          ...s,
          weight: convertWeightStr(s.weight, unit, next),
        })),
      })),
    );
    setUnit(next);
  };

  const handleAddCustom = () => {
    const name = customName.trim();
    if (name.length < 1) return;
    createExercise.mutate(
      { name, muscleGroup: customGroup },
      {
        onSuccess: (ex) => {
          toast.success(`Added "${ex.name}"`);
          setCustomName("");
          setShowCustom(false);
          addExercise(ex);
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { detail?: string } } };
          toast.error(e.response?.data?.detail || "Could not add exercise");
        },
      },
    );
  };

  const reset = () => {
    setEntries([]);
    setLogDate(todayStr());
    setPickerOpen(false);
    setSearch("");
    setShowCustom(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (entries.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }
    // Build payload, dropping empty sets and converting to kg.
    const payloadEntries = entries
      .map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets
          .filter((s) => s.reps.trim() !== "" && Number(s.reps) > 0)
          .map((s) => ({
            weightKg: s.weight.trim() === "" ? null : toKg(parseFloat(s.weight), unit),
            reps: Math.round(Number(s.reps)),
          })),
      }))
      .filter((e) => e.sets.length > 0);

    if (payloadEntries.length === 0) {
      toast.error("Each exercise needs at least one set with reps");
      return;
    }

    createWorkout.mutate(
      { logDate, entries: payloadEntries },
      {
        onSuccess: () => {
          toast.success("Workout logged! 🏋️");
          handleClose();
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { detail?: string } } };
          toast.error(e.response?.data?.detail || "Failed to save workout");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-0 p-0 max-w-lg">
        <div className="p-6 flex flex-col gap-5 overflow-y-auto min-h-0">
          <DialogHeader>
            <DialogTitle style={{ color: "var(--foreground)" }}>
              Log Workout
            </DialogTitle>
            <DialogDescription style={{ color: "var(--muted-foreground)" }}>
              Add exercises and log the weight &amp; reps for each set.
            </DialogDescription>
          </DialogHeader>

          {/* Date + unit toggle */}
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Date
              </Label>
              <Input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div
              className="flex gap-1 p-1 rounded-xl"
              style={{ background: "var(--muted)" }}
            >
              {(["kg", "lb"] as WeightUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleUnitToggle(u)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all"
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
          </div>

          {/* Entries */}
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {entries.map((entry, entryIdx) => (
                <motion.div
                  key={`${entry.exerciseId}-${entryIdx}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl p-3 flex flex-col gap-2.5"
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  {/* Entry header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {entry.exerciseName}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--primary)" }}
                      >
                        {entry.muscleGroup}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEntry(entryIdx)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                      style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Column labels */}
                  <div
                    className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 px-1 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <span>Set</span>
                    <span>Weight ({unit})</span>
                    <span>Reps</span>
                    <span />
                  </div>

                  {/* Set rows */}
                  {entry.sets.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center"
                    >
                      <span
                        className="text-xs font-semibold text-center"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {setIdx + 1}
                      </span>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder="—"
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(entryIdx, setIdx, "weight", e.target.value)
                        }
                        className="h-9"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--glass-border)",
                          color: "var(--foreground)",
                        }}
                      />
                      <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="0"
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(entryIdx, setIdx, "reps", e.target.value)
                        }
                        className="h-9"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--glass-border)",
                          color: "var(--foreground)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeSet(entryIdx, setIdx)}
                        disabled={entry.sets.length === 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-30"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addSet(entryIdx)}
                    className="self-start flex items-center gap-1 text-xs font-medium mt-0.5 transition-opacity hover:opacity-80"
                    style={{ color: "var(--primary)" }}
                  >
                    <Plus size={12} /> Add set
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {entries.length === 0 && !pickerOpen && (
              <div
                className="flex flex-col items-center justify-center gap-1.5 py-6 rounded-xl"
                style={{
                  background: "var(--muted)",
                  border: "1px dashed var(--glass-border)",
                }}
              >
                <Dumbbell size={20} style={{ color: "var(--muted-foreground)" }} />
                <span
                  className="text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  No exercises yet — add one below
                </span>
              </div>
            )}
          </div>

          {/* Exercise picker */}
          <AnimatePresence initial={false}>
            {pickerOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div className="p-3 flex flex-col gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                    <Input
                      autoFocus
                      placeholder="Search exercises…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>

                  {/* Grouped list */}
                  <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                    {grouped.length === 0 && (
                      <span
                        className="text-xs text-center py-3"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {exercisesLoading
                          ? "Loading exercises…"
                          : exercisesError
                            ? "Couldn't load the exercise library — is the backend running?"
                            : exercises.length === 0
                              ? "Exercise library is empty — restart the backend to seed it"
                              : "No matches"}
                      </span>
                    )}
                    {grouped.map(({ group, items }) => (
                      <div key={group} className="flex flex-col gap-1">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-widest px-1"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {group}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((ex) => (
                            <button
                              key={ex.id}
                              type="button"
                              onClick={() => addExercise(ex)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{
                                background: "var(--background)",
                                border: "1px solid var(--glass-border)",
                                color: "var(--foreground)",
                              }}
                            >
                              {ex.name}
                              {ex.isCustom && (
                                <span style={{ color: "var(--primary)" }}> ·</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom exercise */}
                  {showCustom ? (
                    <div
                      className="flex flex-col gap-2 p-2.5 rounded-lg"
                      style={{ background: "var(--background)" }}
                    >
                      <Input
                        placeholder="New exercise name"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        style={{
                          background: "var(--muted)",
                          border: "1px solid var(--glass-border)",
                          color: "var(--foreground)",
                        }}
                      />
                      <div className="flex gap-2">
                        <Select
                          value={customGroup}
                          onValueChange={(v) => setCustomGroup(v as MuscleGroup)}
                        >
                          <SelectTrigger
                            className="flex-1 capitalize"
                            style={{
                              background: "var(--muted)",
                              border: "1px solid var(--glass-border)",
                              color: "var(--foreground)",
                            }}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            style={{
                              background: "var(--glass-bg)",
                              backdropFilter: "blur(20px)",
                              border: "1px solid var(--glass-border)",
                            }}
                          >
                            {MUSCLE_GROUPS.map((g) => (
                              <SelectItem
                                key={g}
                                value={g}
                                className="capitalize cursor-pointer"
                                style={{ color: "var(--foreground)" }}
                              >
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          onClick={handleAddCustom}
                          disabled={createExercise.isPending || !customName.trim()}
                          style={{
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                          }}
                        >
                          {createExercise.isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCustom(true)}
                      className="self-start flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
                      style={{ color: "var(--primary)" }}
                    >
                      <Plus size={12} /> Create custom exercise
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!pickerOpen && (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
                color: "var(--primary)",
              }}
            >
              <Plus size={15} /> Add Exercise
            </button>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
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
              type="button"
              onClick={handleSubmit}
              disabled={createWorkout.isPending}
              className="flex-1 font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {createWorkout.isPending ? (
                <Loader2 size={15} className="animate-spin mr-2" />
              ) : null}
              Save Workout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
