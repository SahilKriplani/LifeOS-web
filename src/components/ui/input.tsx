import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 outline-none",
        // Themed, lighter surface — translucent fill instead of a heavy solid block.
        "bg-[color-mix(in_srgb,var(--muted)_55%,transparent)] border border-[var(--glass-border)]",
        "text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
        // Clean focus + invalid states.
        "focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_30%,transparent)]",
        "aria-invalid:border-rose-500 aria-invalid:ring-2 aria-invalid:ring-rose-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Kill the native number-input spinner arrows.
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
