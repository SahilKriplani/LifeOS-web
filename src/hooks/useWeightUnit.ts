"use client";

import { useSyncExternalStore } from "react";
import type { WeightUnit } from "@/types";

const STORAGE_KEY = "lifeos-weight-unit";
const listeners = new Set<() => void>();

function read(): WeightUnit {
  if (typeof window === "undefined") return "kg";
  return window.localStorage.getItem(STORAGE_KEY) === "lb" ? "lb" : "kg";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb); // cross-tab sync
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/**
 * kg/lb preference backed by localStorage. The DB always stores kg; this is a
 * pure display/entry convenience (no backend column). Implemented as an external
 * store so every consumer (modal + history) stays in sync and SSR is mismatch-free.
 */
export function useWeightUnit(): [WeightUnit, (u: WeightUnit) => void] {
  const unit = useSyncExternalStore(subscribe, read, () => "kg" as WeightUnit);

  const setUnit = (u: WeightUnit) => {
    window.localStorage.setItem(STORAGE_KEY, u);
    listeners.forEach((l) => l()); // notify same-tab consumers
  };

  return [unit, setUnit];
}
