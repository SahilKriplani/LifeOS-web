import { create } from "zustand";
import { Task } from "@/types";
import { getTodayISO } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlannerState {
  tasks: Task[];
  selectedDate: string; // "YYYY-MM-DD"
  isLoading: boolean;

  // Actions
  setTasks: (tasks: Task[]) => void;
  toggleTask: (id: number) => void;
  addTask: (task: Task) => void;
  removeTask: (id: number) => void;
  setSelectedDate: (date: string) => void;
  setLoading: (loading: boolean) => void;
  getCompletionPercent: () => number;
}

// ─── Store ────────────────────────────────────────────────────────────────────
const usePlannerStore = create<PlannerState>((set, get) => ({
  tasks: [],
  selectedDate: getTodayISO(),
  isLoading: false,

  setTasks: (tasks) => set({ tasks }),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task,
      ),
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setLoading: (loading) => set({ isLoading: loading }),

  getCompletionPercent: () => {
    const { tasks } = get();
    if (tasks.length === 0) return 0;
    const done = tasks.filter((t) => t.isDone).length;
    return Math.round((done / tasks.length) * 100);
  },
}));

export default usePlannerStore;
