import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Core className utility ───────────────────────────────────────────────────
// Used everywhere: cn("base-class", condition && "conditional-class")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date utilities ───────────────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Number utilities ─────────────────────────────────────────────────────────
export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

// ─── String utilities ─────────────────────────────────────────────────────────
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

// ─── Priority color map ───────────────────────────────────────────────────────
export const priorityColor: Record<string, string> = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-rose-400",
};

// ─── Difficulty color map ─────────────────────────────────────────────────────
export const difficultyColor: Record<string, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};
