"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Receipt,
  Plus,
} from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import TransactionDialog from "@/components/finance/TransactionDialog";
import AccountsSection from "@/components/finance/AccountsSection";
import CategoriesSection from "@/components/finance/CategoriesSection";
import {
  useFinanceSummary,
  useTransactions,
  useDeleteTransaction,
} from "@/hooks/useFinance";
import type { Transaction } from "@/types";
import toast from "react-hot-toast";

const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

// ─── Chart tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass rounded-lg px-3 py-2 text-xs flex flex-col gap-1"
      style={{ border: "1px solid var(--glass-border)" }}
    >
      <span className="font-semibold" style={{ color: "var(--foreground)" }}>
        {label}
      </span>
      {payload.map((e) => (
        <span key={e.dataKey} style={{ color: e.color }}>
          {e.dataKey === "income" ? "Income" : "Expense"}: ₹
          {e.value.toLocaleString("en-IN")}
        </span>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FinancePage() {
  const { data: summary } = useFinanceSummary(30);
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTxn = useDeleteTransaction();

  const income = summary?.totalIncome ?? 0;
  const expense = summary?.totalExpense ?? 0;
  const balance = summary?.balance ?? 0;

  const chartData = (summary?.daily ?? []).map((d) => ({
    date: d.date.slice(5),
    income: d.income,
    expense: d.expense,
  }));
  const hasChartData = income > 0 || expense > 0;

  const handleDelete = (id: number) => {
    deleteTxn.mutate(id, {
      onSuccess: () => toast.success("Transaction deleted"),
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between gap-4"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Wallet size={18} style={{ color: "var(--primary)" }} />
            <h1
              className="text-xl md:text-2xl font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Finance
            </h1>
          </div>
          <p
            className="text-xs md:text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Track spending &amp; income — last 30 days
          </p>
        </div>

        <TransactionDialog
          trigger={
            <Button
              className="h-9 gap-1.5 px-4 font-semibold shrink-0"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <Plus size={16} />
              Add transaction
            </Button>
          }
        />
      </motion.div>

      {/* Hero — stats + trend chart in one compact card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <GlassCard
          padding="md"
          className="flex flex-col gap-6 lg:flex-row lg:items-stretch"
        >
          {/* Stats rail */}
          <div className="flex flex-row justify-between gap-4 lg:w-44 lg:shrink-0 lg:flex-col lg:justify-center">
            <HeroStat
              label="Income"
              value={money(income)}
              accent="#10b981"
              icon={<ArrowUpRight size={15} className="text-emerald-400" />}
            />
            <HeroStat
              label="Expense"
              value={money(expense)}
              accent="#f43f5e"
              icon={<ArrowDownRight size={15} className="text-rose-400" />}
            />
            <HeroStat
              label="Balance"
              value={money(balance)}
              accent={balance < 0 ? "#fb7185" : "var(--primary)"}
              icon={<Wallet size={15} style={{ color: "var(--primary)" }} />}
            />
          </div>

          {/* Divider (desktop) */}
          <div
            className="hidden lg:block w-px shrink-0"
            style={{ background: "var(--glass-border)" }}
          />

          {/* Trend chart */}
          <div className="flex flex-1 flex-col gap-3 min-w-0">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Income vs Expense
            </h3>
            <div className="h-44">
              {!hasChartData ? (
                <div className="h-full flex items-center justify-center">
                  <p
                    className="text-sm"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    No transactions yet — add one above
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="fIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="fExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={24}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#fIncome)"
                      animationDuration={800}
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      fill="url(#fExpense)"
                      animationDuration={800}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Accounts (rail) + Categories & budgets (main) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-1">
          <AccountsSection />
        </div>
        <div className="lg:col-span-2">
          <CategoriesSection />
        </div>
      </div>

      {/* Transaction ledger */}
      <GlassCard padding="md" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={16} style={{ color: "var(--primary)" }} />
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Recent Transactions
            </h3>
          </div>
          <TransactionDialog
            trigger={
              <Button
                variant="ghost"
                className="h-8 gap-1.5 px-3 text-xs font-semibold"
                style={{ color: "var(--primary)" }}
              >
                <Plus size={14} />
                Add
              </Button>
            }
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg animate-pulse"
                style={{ background: "var(--muted)" }}
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-10 flex items-center justify-center">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              No transactions yet
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[28rem] overflow-y-auto">
            <AnimatePresence>
              {transactions.map((t) => (
                <TransactionRow key={t.id} txn={t} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ─── Hero stat ────────────────────────────────────────────────────────────────
function HeroStat({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className="text-[0.65rem] uppercase tracking-widest font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          {label}
        </span>
        <span
          className="text-lg font-bold tabular-nums"
          style={{ color: accent }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── Transaction row ──────────────────────────────────────────────────────────
function TransactionRow({
  txn,
  onDelete,
}: {
  txn: Transaction;
  onDelete: (id: number) => void;
}) {
  const isIncome = txn.type === "income";
  const label = txn.categoryName ?? "Uncategorized";
  // Account + optional note, shown as the secondary line.
  const meta = [txn.accountName, txn.note].filter(Boolean).join(" · ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-2.5 px-3 rounded-lg group"
      style={{ background: "var(--muted)" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: isIncome ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
        }}
      >
        {isIncome ? (
          <ArrowUpRight size={15} className="text-emerald-400" />
        ) : (
          <ArrowDownRight size={15} className="text-rose-400" />
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span
          className="text-sm capitalize truncate"
          style={{ color: "var(--foreground)" }}
        >
          {label}
        </span>
        <span
          className="text-xs truncate"
          style={{ color: "var(--muted-foreground)" }}
        >
          {meta ? `${meta} · ${txn.date}` : txn.date}
        </span>
      </div>

      <span
        className="text-sm font-semibold shrink-0 tabular-nums"
        style={{ color: isIncome ? "#10b981" : "#f43f5e" }}
      >
        {isIncome ? "+" : "−"}
        {money(txn.amount)}
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(txn.id)}
        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
        style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e" }}
      >
        <Trash2 size={12} />
      </motion.button>
    </motion.div>
  );
}
