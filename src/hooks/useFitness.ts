import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  FitnessLog,
  FitnessStats,
  CreateFitnessLogPayload,
} from "@/types";

// ─── API calls ────────────────────────────────────────────────────────────────
const fetchLogs = async (from?: string, to?: string): Promise<FitnessLog[]> => {
  const params = new URLSearchParams();
  if (from) params.append("from_date", from);
  if (to) params.append("to_date", to);
  const res = await api.get(`/fitness/logs?${params.toString()}`);
  return res.data.data.map((l: Record<string, unknown>) => ({
    id: l.id,
    userId: l.user_id,
    logDate: l.log_date,
    weightKg: l.weight_kg,
    calories: l.calories,
    steps: l.steps,
    notes: l.notes,
  }));
};

const fetchStats = async (): Promise<FitnessStats> => {
  const res = await api.get("/fitness/stats");
  const raw = res.data.data;
  return {
    currentWeight: raw.current_weight,
    targetWeight: 85,
    weightLost: raw.weight_lost,
    averageCalories: raw.average_calories,
    averageSteps: raw.average_steps,
  };
};

const createLog = async (
  payload: CreateFitnessLogPayload,
): Promise<FitnessLog> => {
  const res = await api.post("/fitness/logs", {
    log_date: payload.logDate,
    weight_kg: payload.weightKg,
    calories: payload.calories,
    steps: payload.steps,
    notes: payload.notes,
  });
  return res.data.data;
};

const deleteLog = async (id: number): Promise<void> => {
  await api.delete(`/fitness/logs/${id}`);
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useFitnessLogs(from?: string, to?: string) {
  return useQuery({
    queryKey: ["fitness-logs", from, to],
    queryFn: () => fetchLogs(from, to),
  });
}

export function useFitnessStats() {
  return useQuery({
    queryKey: ["fitness-stats"],
    queryFn: fetchStats,
  });
}

export function useCreateFitnessLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fitness-logs"] });
      queryClient.invalidateQueries({ queryKey: ["fitness-stats"] });
    },
  });
}

export function useDeleteFitnessLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fitness-logs"] });
      queryClient.invalidateQueries({ queryKey: ["fitness-stats"] });
    },
  });
}
