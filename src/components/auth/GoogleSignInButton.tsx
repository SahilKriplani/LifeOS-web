"use client";

import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { setToken, clearToken } from "@/lib/auth";
import useUserStore from "@/store/useUserStore";
import { GoogleButtonGlass } from "@/components/auth/GoogleButtonDesigns";

// Renders Google's branded "Sign in with Google" button. On success Google
// hands us an ID token (the `credential` JWT); we POST it to our backend, which
// verifies the signature and returns OUR app JWT + user — same shape as the
// email/password flow. If NEXT_PUBLIC_GOOGLE_CLIENT_ID isn't configured the
// GoogleOAuthProvider isn't mounted, so this component renders nothing.
export default function GoogleSignInButton() {
  const setUser = useUserStore((state) => state.setUser);

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: "var(--glass-border)" }} />
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          or
        </span>
        <span className="h-px flex-1" style={{ background: "var(--glass-border)" }} />
      </div>

      {/*
        Overlay technique: our custom glass button is the VISIBLE layer
        (pointer-events off so it never swallows the click), and Google's real
        widget sits on top, stretched to fill the button but rendered
        invisible. Every click lands on the genuine Google widget, so the
        secure ID-token flow is fully preserved — we only restyle the surface.
      */}
      <div className="relative w-full">
        <div className="pointer-events-none">
          <GoogleButtonGlass />
        </div>
        <div
          className="absolute inset-0 opacity-0 [&>div]:!w-full [&>div]:!h-full [&_iframe]:!w-full [&_iframe]:!h-full"
          aria-hidden="true"
        >
          <GoogleLogin
            theme="filled_black"
            shape="pill"
            text="continue_with"
            width="400"
            onSuccess={async (credentialResponse) => {
            const credential = credentialResponse.credential;
            if (!credential) {
              toast.error("Google sign-in failed — no credential returned");
              return;
            }

            try {
              const res = await api.post("/auth/google", { credential });

              if (!res.data?.token) {
                throw new Error("Token missing from backend response");
              }

              setToken(res.data.token);
              setUser(res.data.user);

              toast.success("Signed in with Google!");

              // Hard navigation so the edge middleware (proxy.ts) re-runs with
              // the freshly-set cookie — same reason as the email/password flow.
              window.location.assign("/dashboard");
            } catch (err: unknown) {
              clearToken();
              const error = err as {
                response?: { data?: { detail?: string } };
                message?: string;
              };
              toast.error(
                error.response?.data?.detail ||
                  error.message ||
                  "Google sign-in failed",
              );
            }
          }}
            onError={() => {
              toast.error("Google sign-in failed");
            }}
          />
        </div>
      </div>
    </div>
  );
}
