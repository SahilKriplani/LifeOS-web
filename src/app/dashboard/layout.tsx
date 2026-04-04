import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    template: "%s | LifeOS",
    default: "LifeOS",
  },
  description: "Your personal life operating system",
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
