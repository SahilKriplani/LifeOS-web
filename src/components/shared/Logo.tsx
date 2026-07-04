import { cn } from "@/lib/utils";

/**
 * LifeOS brand mark — a teal-gradient app tile with a clean "L" and a
 * progress-dot accent (echoing the ProgressRing motif used across the app).
 * Single source of truth for the icon: the favicon (src/app/icon.svg) mirrors
 * this artwork. Use the `size` prop to scale; defaults to 32px.
 */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="lifeos-tile"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#lifeos-tile)" />
      <path
        d="M12 8.5 V21.5 H21"
        stroke="white"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.5" cy="10.5" r="2.1" fill="white" />
    </svg>
  );
}
