import { create } from "zustand";
import { DSALog, DSAStats } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DSAState {
  logs: DSALog[];
  stats: DSAStats | null;
  isLoading: boolean;

  // Actions
  setLogs: (logs: DSALog[]) => void;
  setStats: (stats: DSAStats) => void;
  addLog: (log: DSALog) => void;
  removeLog: (id: number) => void;
  setLoading: (loading: boolean) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
const useDSAStore = create<DSAState>((set) => ({
  logs: [],
  stats: null,
  isLoading: false,

  setLogs: (logs) => set({ logs }),

  setStats: (stats) => set({ stats }),

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
    })),

  removeLog: (id) =>
    set((state) => ({
      logs: state.logs.filter((log) => log.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useDSAStore;
