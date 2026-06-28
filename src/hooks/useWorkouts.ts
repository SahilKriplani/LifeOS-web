import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  Exercise,
  CreateExercisePayload,
  WorkoutSession,
  CreateWorkoutPayload,
  MuscleGroup,
} from "@/types";

// ─── Mappers (snake_case API ↔ camelCase app) ──────────────────────────────────
function mapExercise(e: Record<string, unknown>): Exercise {
  return {
    id: e.id as number,
    name: e.name as string,
    muscleGroup: e.muscle_group as MuscleGroup,
    isCustom: e.is_custom as boolean,
    userId: (e.user_id as number | null) ?? null,
  };
}

function mapSession(s: Record<string, unknown>): WorkoutSession {
  const exercises = (s.exercises as Record<string, unknown>[]) ?? [];
  return {
    id: s.id as number,
    userId: s.user_id as number,
    logDate: s.log_date as string,
    notes: (s.notes as string | null) ?? null,
    exercises: exercises.map((ex) => ({
      exerciseId: ex.exercise_id as number,
      exerciseName: ex.exercise_name as string,
      muscleGroup: ex.muscle_group as MuscleGroup,
      sets: ((ex.sets as Record<string, unknown>[]) ?? []).map((st) => ({
        setNumber: st.set_number as number,
        weightKg: (st.weight_kg as number | null) ?? null,
        reps: st.reps as number,
      })),
    })),
  };
}

// ─── API calls ────────────────────────────────────────────────────────────────
const fetchExercises = async (): Promise<Exercise[]> => {
  const res = await api.get("/exercises");
  return (res.data.data as Record<string, unknown>[]).map(mapExercise);
};

const createExercise = async (
  payload: CreateExercisePayload,
): Promise<Exercise> => {
  const res = await api.post("/exercises", {
    name: payload.name,
    muscle_group: payload.muscleGroup,
  });
  return mapExercise(res.data.data);
};

const deleteExercise = async (id: number): Promise<void> => {
  await api.delete(`/exercises/${id}`);
};

const fetchWorkouts = async (
  from?: string,
  to?: string,
): Promise<WorkoutSession[]> => {
  const params = new URLSearchParams();
  if (from) params.append("from_date", from);
  if (to) params.append("to_date", to);
  const res = await api.get(`/workouts?${params.toString()}`);
  return (res.data.data as Record<string, unknown>[]).map(mapSession);
};

const createWorkout = async (
  payload: CreateWorkoutPayload,
): Promise<WorkoutSession> => {
  const res = await api.post("/workouts", {
    log_date: payload.logDate,
    notes: payload.notes ?? null,
    entries: payload.entries.map((entry) => ({
      exercise_id: entry.exerciseId,
      sets: entry.sets.map((s) => ({ weight_kg: s.weightKg, reps: s.reps })),
    })),
  });
  return mapSession(res.data.data);
};

const deleteWorkout = async (id: number): Promise<void> => {
  await api.delete(`/workouts/${id}`);
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
    staleTime: 1000 * 60 * 10, // library rarely changes — cache 10 min
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExercise,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExercise,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useWorkouts(from?: string, to?: string) {
  return useQuery({
    queryKey: ["workouts", from, to],
    queryFn: () => fetchWorkouts(from, to),
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkout,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  });
}
