import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Goal {
  id: number;
  userId: number;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  color: string;
  category: "dsa" | "fitness" | "career" | "personal";
  deadline: string;
}

export interface CreateGoalPayload {
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  color: string;
  category: "dsa" | "fitness" | "career" | "personal";
  deadline: string;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  current?: number;
  color?: string;
  deadline?: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────
const fetchGoals = async (): Promise<Goal[]> => {
  const res = await api.get("/goals");
  return res.data.data.map((g: Record<string, unknown>) => ({
    id: g.id,
    userId: g.user_id,
    title: g.title,
    description: g.description ?? "",
    target: Number(g.target),
    current: Number(g.current),
    unit: g.unit,
    color: g.color,
    category: g.category,
    deadline: g.deadline,
  }));
};

const createGoal = async (payload: CreateGoalPayload): Promise<Goal> => {
  const res = await api.post("/goals", {
    title: payload.title,
    description: payload.description,
    target: payload.target,
    current: payload.current,
    unit: payload.unit,
    color: payload.color,
    category: payload.category,
    deadline: payload.deadline,
  });
  return res.data.data;
};

const updateGoal = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateGoalPayload;
}): Promise<Goal> => {
  const res = await api.patch(`/goals/${id}`, payload);
  return res.data.data;
};

const deleteGoal = async (id: number): Promise<void> => {
  await api.delete(`/goals/${id}`);
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
