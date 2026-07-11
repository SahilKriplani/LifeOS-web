"use client";

/**
 * Presentational Google sign-in button designs.
 *
 * These are the VISUAL layer only — click handling is wired separately.
 * In production the real (transparent) Google widget is overlaid on top to
 * preserve the secure ID-token flow; see GoogleSignInButton.tsx. Here they
 * accept an optional onClick so they can be previewed in isolation.
 */

// ─── Official 4-colour Google "G" ─────────────────────────────────────────────
export function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

type Props = {
  onClick?: () => void;
  label?: string;
};

// ─── Variant A — Glass pill ───────────────────────────────────────────────────
// Translucent glass surface + blur, matches the app's glass language. Lifts on
// hover. Feels native to LifeOS.
export function GoogleButtonGlass({
  onClick,
  label = "Continue with Google",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full h-11 rounded-xl flex items-center justify-center gap-3 text-sm font-medium
                 border border-[color-mix(in_srgb,var(--foreground)_18%,transparent)]
                 transition-all duration-200 hover:-translate-y-0.5
                 hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)]
                 hover:shadow-[0_10px_30px_rgba(0,0,0,0.30)]"
      style={{
        // Layered glass: a faint top-lit gradient over the translucent surface,
        // an inset highlight along the top edge, and a soft drop shadow. The
        // brighter border (above) makes the button's edges clearly sensable.
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--foreground) 8%, var(--glass-bg)), var(--glass-bg))",
        backdropFilter: "blur(18px) saturate(185%)",
        WebkitBackdropFilter: "blur(18px) saturate(185%)",
        boxShadow:
          "inset 0 1px 0 color-mix(in srgb, var(--foreground) 15%, transparent), 0 2px 10px rgba(0,0,0,0.22)",
        color: "var(--foreground)",
      }}
    >
      <GoogleG size={18} />
      {label}
    </button>
  );
}

// ─── Variant B — Solid white ──────────────────────────────────────────────────
// Classic Google-recommended white button, restyled to rounded-xl with a soft
// shadow. Maximum familiarity + contrast against the dark auth screen.
export function GoogleButtonSolid({
  onClick,
  label = "Continue with Google",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-11 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold
                 bg-white text-[#1f1f1f] shadow-sm hover:shadow-md
                 transition-all duration-200 hover:-translate-y-0.5"
    >
      <GoogleG size={18} />
      {label}
    </button>
  );
}

// ─── Variant C — Outline with teal hover ──────────────────────────────────────
// Minimal ghost button; border + faint fill glow teal (the brand accent) on
// hover. Understated and modern.
export function GoogleButtonOutline({
  onClick,
  label = "Continue with Google",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full h-11 rounded-xl flex items-center justify-center gap-3 text-sm font-medium
                 border border-[var(--glass-border)] bg-transparent text-[var(--foreground)]
                 transition-all duration-200
                 hover:border-[var(--primary)]
                 hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]"
    >
      <GoogleG size={18} />
      {label}
    </button>
  );
}
