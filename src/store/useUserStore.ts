import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserState {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "lifeos-user", // localStorage key
      partialize: (state) => ({
        // only persist these fields
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useUserStore;
