"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ─── Date helpers (local time, "YYYY-MM-DD") ──────────────────────────────────
function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Parse "YYYY-MM-DD" as a *local* date (new Date(str) treats it as UTC).
function fromISO(s: string | undefined | null): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function prettyLabel(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface DatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string; // "YYYY-MM-DD"
  max?: string; // "YYYY-MM-DD"
  className?: string;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  min,
  max,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = fromISO(value);
  // The month currently shown in the grid; defaults to the selected month.
  const [view, setView] = React.useState<Date>(
    () => selected ?? new Date(),
  );

  // Re-sync the visible month whenever the popover opens on a new value.
  React.useEffect(() => {
    if (open) setView(selected ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const minDate = fromISO(min);
  const maxDate = fromISO(max);
  const todayISO = toISO(new Date());

  // Build the 6-week grid for the visible month.
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0=Sun
  const gridStart = new Date(year, month, 1 - startWeekday);

  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const iso = toISO(d);
    return {
      date: d,
      iso,
      inMonth: d.getMonth() === month,
      isToday: iso === todayISO,
      isSelected: !!value && iso === value,
      disabled:
        (minDate !== null && d < minDate) ||
        (maxDate !== null && d > maxDate),
    };
  });

  const goMonth = (delta: number) =>
    setView(new Date(year, month + delta, 1));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm",
            "bg-[color-mix(in_srgb,var(--muted)_55%,transparent)] border border-[var(--glass-border)]",
            "transition-all duration-200 outline-none",
            "focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_30%,transparent)]",
            className,
          )}
          style={{
            color: selected ? "var(--foreground)" : "var(--muted-foreground)",
          }}
        >
          <span className="line-clamp-1">
            {selected ? prettyLabel(selected) : placeholder}
          </span>
          <CalendarDays
            size={15}
            style={{ color: "var(--muted-foreground)", flexShrink: 0 }}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[17rem]" align="start">
        {/* Month header */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}
            aria-label="Previous month"
          >
            <ChevronLeft size={15} />
          </button>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {MONTHS[month]} {year}
          </span>
          <button
            type="button"
            onClick={() => goMonth(1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}
            aria-label="Next month"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w) => (
            <span
              key={w}
              className="text-[10px] font-semibold text-center uppercase tracking-wide py-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              {w}
            </span>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <button
              key={d.iso}
              type="button"
              disabled={d.disabled}
              onClick={() => {
                onChange(d.iso);
                setOpen(false);
              }}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-medium flex items-center justify-center",
                "transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed",
                !d.isSelected && "hover:bg-primary/10",
                d.isToday && !d.isSelected && "ring-1",
              )}
              style={{
                background: d.isSelected ? "var(--primary)" : "transparent",
                color: d.isSelected
                  ? "var(--primary-foreground)"
                  : d.inMonth
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                opacity: !d.inMonth && !d.isSelected ? 0.4 : undefined,
              }}
            >
              {d.date.getDate()}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
