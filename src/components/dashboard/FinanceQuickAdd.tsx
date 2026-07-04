"use client";

import Link from "next/link";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import TransactionDialog from "@/components/finance/TransactionDialog";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useFinanceSummary } from "@/hooks/useFinance";

const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

// ─── Component ────────────────────────────────────────────────────────────────
// Compact money card for the dashboard: trailing-30-day income/expense/balance
// plus a one-tap "Add transaction" button that opens the shared modal. The full
// ledger, accounts, and budgets live on /dashboard/finance.
export default function FinanceQuickAdd() {
  const { data: summary } = useFinanceSummary(30);

  const income = summary?.totalIncome ?? 0;
  const expense = summary?.totalExpense ?? 0;
  const balance = summary?.balance ?? 0;

  return (
    <GlassCard
      padding="md"
      className="flex flex-col xl:flex-row xl:items-center gap-5 xl:gap-8"
    >
      {/* Left: heading + stats */}
      <div className="flex items-center gap-4 shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "color-mix(in srgb, var(--primary) 14%, transparent)",
          }}
        >
          <Wallet size={18} style={{ color: "var(--primary)" }} />
        </div>

        <div className="flex items-center gap-5">
          <Stat
            label="Income"
            value={money(income)}
            icon={<ArrowUpRight size={13} className="text-emerald-400" />}
          />
          <Stat
            label="Expense"
            value={money(expense)}
            icon={<ArrowDownRight size={13} className="text-rose-400" />}
          />
          <Stat
            label="Balance"
            value={money(balance)}
            valueColor={balance < 0 ? "#fb7185" : "var(--primary)"}
          />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex flex-1 items-center gap-2 xl:justify-end">
        <TransactionDialog
          trigger={
            <Button
              className="h-9 gap-1.5 px-4 font-semibold shrink-0"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <Plus size={15} />
              Add transaction
            </Button>
          }
        />
        <Link href="/dashboard/finance">
          <Button
            variant="ghost"
            className="h-9 gap-1.5 px-3 text-sm font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Details
            <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}

// ─── Small stat ───────────────────────────────────────────────────────────────
function Stat({
  label,
  value,
  icon,
  valueColor = "var(--foreground)",
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="text-[0.65rem] uppercase tracking-widest font-medium flex items-center gap-1"
        style={{ color: "var(--muted-foreground)" }}
      >
        {icon}
        {label}
      </span>
      <span className="text-base font-bold" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}
