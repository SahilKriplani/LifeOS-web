import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { DSALog, DSAStats, CreateDSALogPayload } from "@/types";

// ─── API calls ────────────────────────────────────────────────────────────────
const fetchLogs = async (from?: string, to?: string): Promise<DSALog[]> => {
  const params = new URLSearchParams();
  if (from) params.append("from_date", from);
  if (to) params.append("to_date", to);
  const res = await api.get(`/dsa/logs?${params.toString()}`);
  return res.data.data.map((l: Record<string, unknown>) => ({
    id: l.id,
    userId: l.user_id,
    problemName: l.problem_name,
    platform: l.platform,
    difficulty: l.difficulty,
    topic: l.topic,
    solvedAt: l.solved_at,
  }));
};

const fetchStats = async (): Promise<DSAStats> => {
  const res = await api.get("/dsa/stats");
  const raw = res.data.data;
  return {
    total: raw.total,
    easy: raw.easy,
    medium: raw.medium,
    hard: raw.hard,
    byTopic: raw.by_topic,
  };
};

const createLog = async (payload: CreateDSALogPayload): Promise<DSALog> => {
  const res = await api.post("/dsa/logs", {
    problem_name: payload.problemName,
    platform: payload.platform,
    difficulty: payload.difficulty,
    topic: payload.topic,
    solved_at: payload.solvedAt,
  });
  return res.data.data;
};

const deleteLog = async (id: number): Promise<void> => {
  await api.delete(`/dsa/logs/${id}`);
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useDSALogs(from?: string, to?: string) {
  return useQuery({
    queryKey: ["dsa-logs", from, to],
    queryFn: () => fetchLogs(from, to),
  });
}

export function useDSAStats() {
  return useQuery({
    queryKey: ["dsa-stats"],
    queryFn: fetchStats,
  });
}

export function useCreateDSALog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dsa-logs"] });
      queryClient.invalidateQueries({ queryKey: ["dsa-stats"] });
    },
  });
}

export function useDeleteDSALog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dsa-logs"] });
      queryClient.invalidateQueries({ queryKey: ["dsa-stats"] });
    },
  });
}
