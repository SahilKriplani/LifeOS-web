"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/shared/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tags, Plus, Pencil, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import type { Category, TransactionType } from "@/types";
import toast from "react-hot-toast";

const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

// ─── Categories & budgets ──────────────────────────────────────────────────────
// Users curate their own income/expense categories and can attach a monthly
// budget to expense categories. Spend is tracked with a progress bar.
export default function CategoriesSection() {
  const { data: categories = [], isLoading } = useCategories();

  const expense = categories.filter((c) => c.type === "expense");
  const income = categories.filter((c) => c.type === "income");

  return (
    <GlassCard padding="md" className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags size={16} style={{ color: "var(--primary)" }} />
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Categories &amp; Budgets
          </h3>
        </div>
        <CategoryFormDialog
          trigger={
            <Button
              className="h-8 gap-1.5 px-3 text-xs font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <Plus size={14} />
              New category
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg animate-pulse"
              style={{ background: "var(--muted)" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense — with budget tracking */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <ArrowDownRight size={13} className="text-rose-400" />
              <span
                className="text-[0.7rem] uppercase tracking-widest font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                Expense
              </span>
            </div>
            {expense.length === 0 ? (
              <Empty />
            ) : (
              expense.map((c) => <ExpenseRow key={c.id} category={c} />)
            )}
          </div>

          {/* Income — simple list */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <ArrowUpRight size={13} className="text-emerald-400" />
              <span
                className="text-[0.7rem] uppercase tracking-widest font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                Income
              </span>
            </div>
            {income.length === 0 ? (
              <Empty />
            ) : (
              income.map((c) => <IncomeRow key={c.id} category={c} />)
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function Empty() {
  return (
    <p className="text-xs py-2" style={{ color: "var(--muted-foreground)" }}>
      None yet
    </p>
  );
}

// ─── Expense row (with budget progress) ─────────────────────────────────────────
function ExpenseRow({ category }: { category: Category }) {
  const del = useDeleteCategory();
  const hasBudget = category.budget != null && category.budget > 0;
  const pct = hasBudget
    ? Math.min((category.spent / category.budget!) * 100, 100)
    : 0;
  const over = hasBudget && category.spent > category.budget!;
  const barColor = over ? "#f43f5e" : pct > 80 ? "#f59e0b" : "var(--primary)";

  const handleDelete = () =>
    del.mutate(category.id, {
      onSuccess: () => toast.success(`Deleted ${category.name}`),
      onError: () => toast.error("Failed to delete category"),
    });

  return (
    <div
      className="group rounded-lg p-3 flex flex-col gap-2"
      style={{ background: "var(--muted)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-sm capitalize font-medium truncate"
          style={{ color: "var(--foreground)" }}
        >
          {category.name}
        </span>
        <div className="flex items-center gap-2">
          {hasBudget ? (
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {money(category.spent)} / {money(category.budget!)}
            </span>
          ) : (
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              No budget
            </span>
          )}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <CategoryFormDialog
              category={category}
              trigger={
                <button
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: "var(--glass-bg)", color: "var(--muted-foreground)" }}
                  aria-label="Edit category"
                >
                  <Pencil size={11} />
                </button>
              }
            />
            <button
              onClick={handleDelete}
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "rgba(244,63,94,0.12)", color: "#f43f5e" }}
              aria-label="Delete category"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      </div>

      {hasBudget && (
        <>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: "color-mix(in srgb, var(--foreground) 10%, transparent)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full"
              style={{ background: barColor }}
            />
          </div>
          <span
            className="text-[0.7rem] font-medium"
            style={{ color: over ? "#fb7185" : "var(--muted-foreground)" }}
          >
            {over
              ? `Over by ${money(category.spent - category.budget!)}`
              : `${money(category.remaining ?? 0)} remaining`}
          </span>
        </>
      )}
    </div>
  );
}

// ─── Income row ─────────────────────────────────────────────────────────────────
function IncomeRow({ category }: { category: Category }) {
  const del = useDeleteCategory();
  const handleDelete = () =>
    del.mutate(category.id, {
      onSuccess: () => toast.success(`Deleted ${category.name}`),
      onError: () => toast.error("Failed to delete category"),
    });

  return (
    <div
      className="group rounded-lg py-2.5 px-3 flex items-center justify-between"
      style={{ background: "var(--muted)" }}
    >
      <span
        className="text-sm capitalize font-medium truncate"
        style={{ color: "var(--foreground)" }}
      >
        {category.name}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <CategoryFormDialog
          category={category}
          trigger={
            <button
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "var(--glass-bg)", color: "var(--muted-foreground)" }}
              aria-label="Edit category"
            >
              <Pencil size={11} />
            </button>
          }
        />
        <button
          onClick={handleDelete}
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: "rgba(244,63,94,0.12)", color: "#f43f5e" }}
          aria-label="Delete category"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

// ─── Create / edit category dialog ─────────────────────────────────────────────
function CategoryFormDialog({
  trigger,
  category,
}: {
  trigger: React.ReactNode;
  category?: Category;
}) {
  const isEdit = !!category;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name ?? "");
  const [type, setType] = useState<TransactionType>(category?.type ?? "expense");
  const [budget, setBudget] = useState(
    category?.budget != null ? String(category.budget) : "",
  );

  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const pending = createCat.isPending || updateCat.isPending;

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setName(category?.name ?? "");
      setType(category?.type ?? "expense");
      setBudget(category?.budget != null ? String(category.budget) : "");
    }
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Enter a category name");
      return;
    }
    const budgetValue =
      type === "expense" && budget.trim() ? parseFloat(budget) : null;

    if (isEdit) {
      updateCat.mutate(
        { id: category!.id, name: trimmed, budget: budgetValue },
        {
          onSuccess: () => {
            toast.success("Category updated");
            setOpen(false);
          },
          onError: () => toast.error("Failed to update category"),
        },
      );
    } else {
      createCat.mutate(
        { name: trimmed, type, budget: budgetValue },
        {
          onSuccess: () => {
            toast.success("Category created");
            setOpen(false);
          },
          onError: (err: unknown) => {
            const detail =
              (err as { response?: { data?: { detail?: string } } })?.response
                ?.data?.detail ?? "Failed to create category";
            toast.error(detail);
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <div className="p-6 flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit category" : "New category"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Rename or adjust the monthly budget."
                : "Add an income or expense category."}
            </DialogDescription>
          </DialogHeader>

          {/* Type toggle — only when creating */}
          {!isEdit && (
            <div
              className="flex items-center h-9 rounded-lg p-1 gap-1 w-full"
              style={{ background: "var(--muted)" }}
            >
              {(["expense", "income"] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="flex-1 h-full rounded-md text-xs font-medium capitalize transition-all duration-200"
                  style={
                    type === t
                      ? {
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="e.g. Groceries, Rent, Bonus"
              autoFocus
              maxLength={50}
            />
          </div>

          {/* Budget — expense only */}
          {type === "expense" && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Monthly budget (optional)
              </Label>
              <Input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                inputMode="decimal"
                placeholder="e.g. 15000"
              />
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={pending}
            className="h-9 w-full font-semibold"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
