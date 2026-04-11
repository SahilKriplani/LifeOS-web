import api from "@/lib/api";
import useUserStore from "@/store/useUserStore";

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Even if API fails, clear local state
  } finally {
    useUserStore.getState().clearUser();
  }
}
