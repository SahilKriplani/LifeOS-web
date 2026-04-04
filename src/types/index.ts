// ─── User ───────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// ─── Task (Planner) ──────────────────────────────────────────────────────────
export interface Task {
  id: number;
  userId: number;
  title: string;
  isDone: boolean;
  scheduledDate: string; // "YYYY-MM-DD"
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export type CreateTaskPayload = Pick<
  Task,
  "title" | "scheduledDate" | "priority"
>;
export type UpdateTaskPayload = Partial<
  Pick<Task, "title" | "isDone" | "priority">
>;

// ─── DSA ─────────────────────────────────────────────────────────────────────
export interface DSALog {
  id: number;
  userId: number;
  problemName: string;
  platform: "leetcode" | "codeforces" | "gfg" | "other";
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  solvedAt: string; // "YYYY-MM-DD"
}

export interface DSAStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  byTopic: Record<string, number>;
}

export type CreateDSALogPayload = Omit<DSALog, "id" | "userId">;

// ─── Fitness ─────────────────────────────────────────────────────────────────
export interface FitnessLog {
  id: number;
  userId: number;
  logDate: string; // "YYYY-MM-DD"
  weightKg: number;
  calories: number;
  steps: number;
  notes: string;
}

export interface FitnessStats {
  currentWeight: number;
  targetWeight: number;
  weightLost: number;
  averageCalories: number;
  averageSteps: number;
}

export type CreateFitnessLogPayload = Omit<FitnessLog, "id" | "userId">;

// ─── Streak ───────────────────────────────────────────────────────────────────
export interface Streak {
  userId: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // "YYYY-MM-DD"
  weeklyMap: Record<string, boolean>; // { "2025-01-01": true, ... }
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardStats {
  dsaSolved: number;
  currentStreak: number;
  currentWeight: number;
  dailyCompletionPercent: number;
}

// ─── API Response wrapper ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ─── Chart ───────────────────────────────────────────────────────────────────
export type ChartView = "line" | "ring";

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}
