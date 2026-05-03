import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "@/types";

// ─── API calls ────────────────────────────────────────────────────────────────
const fetchTasks = async (date: string): Promise<Task[]> => {
  const res = await api.get(`/tasks?date=${date}`);
  return res.data.data.map((t: Record<string, unknown>) => ({
    id: t.id,
    userId: t.user_id,
    title: t.title,
    isDone: t.is_done,
    scheduledDate: t.scheduled_date,
    priority: t.priority,
    createdAt: t.created_at,
  }));
};

const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const res = await api.post("/tasks", {
    title: payload.title,
    scheduled_date: payload.scheduledDate,
    priority: payload.priority,
  });
  return res.data.data;
};

const updateTask = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateTaskPayload;
}): Promise<Task> => {
  const res = await api.patch(`/tasks/${id}`, {
    title: payload.title,
    is_done: payload.isDone,
    priority: payload.priority,
  });
  return res.data.data;
};

const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useTasks(date: string) {
  return useQuery({
    queryKey: ["tasks", date],
    queryFn: () => fetchTasks(date),
    enabled: !!date,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.scheduledDate],
      });
    },
  });
}

export function useUpdateTask(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", date] });
    },
  });
}

export function useDeleteTask(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", date] });
    },
  });
}
