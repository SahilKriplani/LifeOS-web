import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Streak } from "@/types";

// ─── API calls ────────────────────────────────────────────────────────────────
const fetchStreak = async (): Promise<Streak> => {
  const res = await api.get("/streaks/me");
  const raw = res.data.data;
  return {
    userId: raw.user_id,
    currentStreak: raw.current_streak,
    bestStreak: raw.best_streak,
    lastActiveDate: raw.last_active_date,
    weeklyMap: {},
  };
};

const checkin = async (): Promise<{
  currentStreak: number;
  message: string;
}> => {
  const res = await api.post("/streaks/checkin");
  return {
    currentStreak: res.data.current_streak,
    message: res.data.message,
  };
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useStreak() {
  return useQuery({
    queryKey: ["streak"],
    queryFn: fetchStreak,
  });
}

export function useCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streak"] });
    },
  });
}
