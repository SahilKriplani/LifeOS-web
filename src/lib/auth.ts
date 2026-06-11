import Cookies from "js-cookie";
import api from "@/lib/api";
import useUserStore from "@/store/useUserStore";

const TOKEN_KEY = "access_token";

// The token is kept in a readable cookie (not httpOnly) so the edge route
// guard can see it. It is sent to the API as an Authorization: Bearer header,
// not relied on for cross-site cookie transmission. `secure` only on HTTPS so
// the cookie persists on http://localhost during development.
export function setToken(token: string) {
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    path: "/",
    sameSite: "lax",
    secure: isHttps,
  });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY, { path: "/" });
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Even if API fails, clear local state
  } finally {
    clearToken();
    useUserStore.getState().clearUser();
  }
}
