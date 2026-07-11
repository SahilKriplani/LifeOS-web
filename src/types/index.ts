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
  startWeight: number | null; // earliest logged weight (goal baseline)
  targetWeight: number | null; // user's goal weight, null until set
  weightLost: number;
  averageCalories: number;
  averageSteps: number;
}

export type CreateFitnessLogPayload = Omit<FitnessLog, "id" | "userId">;

// ─── Workout logging (Liftoff-style) ───────────────────────────────────────────
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "forearms"
  | "cardio";

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "core",
  "forearms",
  "cardio",
];

export type WeightUnit = "kg" | "lb";

export interface Exercise {
  id: number;
  name: string;
  muscleGroup: MuscleGroup;
  isCustom: boolean;
  userId: number | null; // null = global seed
}

export interface CreateExercisePayload {
  name: string;
  muscleGroup: MuscleGroup;
}

// A single set within a session (weight is always stored/sent in kg).
export interface WorkoutSet {
  setNumber: number;
  weightKg: number | null;
  reps: number;
}

// One exercise inside a session, with its sets grouped together.
export interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: number;
  userId: number;
  logDate: string; // "YYYY-MM-DD"
  notes: string | null;
  exercises: WorkoutExercise[];
}

// Payload the modal builds and posts (weights already converted to kg).
export interface CreateWorkoutPayload {
  logDate: string;
  notes?: string | null;
  entries: {
    exerciseId: number;
    sets: { weightKg: number | null; reps: number }[];
  }[];
}

// ─── Streak ───────────────────────────────────────────────────────────────────
export interface Streak {
  userId: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // "YYYY-MM-DD"
  activeDates: string[]; // recent active days, e.g. ["2026-06-28", ...]
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

// ─── Finance ─────────────────────────────────────────────────────────────────
export type TransactionType = "income" | "expense";

export interface Account {
  id: number;
  name: string;
  openingBalance: number;
  isDefault: boolean;
  balance: number; // derived: opening + income − expense
}

export interface CreateAccountPayload {
  name: string;
  openingBalance: number;
}

export interface UpdateAccountPayload {
  name?: string;
  openingBalance?: number;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  budget: number | null;
  spent: number; // this calendar month (expense)
  remaining: number | null; // budget − spent, or null when no budget
}

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
  budget?: number | null;
}

export interface UpdateCategoryPayload {
  name?: string;
  budget?: number | null; // null clears the budget
}

export interface Transaction {
  id: number;
  userId: number;
  type: TransactionType;
  amount: number;
  accountId: number;
  accountName: string | null;
  categoryId: number | null;
  categoryName: string | null;
  note: string | null;
  date: string; // "YYYY-MM-DD"
}

export interface CreateTransactionPayload {
  type: TransactionType;
  amount: number;
  accountId: number;
  categoryId?: number | null;
  note?: string | null;
  date: string;
}

export interface UpdateTransactionPayload {
  type?: TransactionType;
  amount?: number;
  accountId?: number;
  categoryId?: number | null;
  note?: string | null;
  date?: string;
}

export interface FinanceDailyPoint {
  date: string;
  income: number;
  expense: number;
}

export interface FinanceCategoryBreakdown {
  category: string;
  total: number;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: FinanceCategoryBreakdown[];
  daily: FinanceDailyPoint[];
}

// ─── Chart ───────────────────────────────────────────────────────────────────
export type ChartView = "line" | "ring" | "finance";

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}
