import type { WeightUnit } from "@/types";

const KG_PER_LB = 0.45359237;

/** Convert a canonical kg value into the user's chosen display unit. */
export function fromKg(kg: number | null, unit: WeightUnit): number | null {
  if (kg === null || kg === undefined) return null;
  return unit === "kg" ? kg : kg / KG_PER_LB;
}

/** Convert a value entered in the user's unit back into canonical kg for storage. */
export function toKg(value: number | null, unit: WeightUnit): number | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return unit === "kg" ? value : value * KG_PER_LB;
}

/** Format a kg value for display in the chosen unit (rounded to 1 dp, no trailing .0). */
export function formatWeight(kg: number | null, unit: WeightUnit): string {
  const v = fromKg(kg, unit);
  if (v === null) return "—";
  const rounded = Math.round(v * 10) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)} ${unit}`;
}
