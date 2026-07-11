"use client";

import { useState } from "react";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryFormDialog from "@/components/finance/CategoryFormDialog";
import CategoriesTable from "@/components/finance/CategoriesTable";
import { Tags, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import type { TransactionType } from "@/types";

// ─── Categories & budgets ──────────────────────────────────────────────────────
// Users curate their own income/expense categories and can attach a monthly
// budget to expense categories. The card itself only shows a compact preview
// (stacked like notifications) — full browsing/editing happens in the drawer,
// which keeps this card's height fixed and in sync with the Accounts card.
export default function CategoriesSection() {
  const { data: categories = [], isLoading } = useCategories();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState<TransactionType>("expense");

  const expense = categories.filter((c) => c.type === "expense");
  const income = categories.filter((c) => c.type === "income");

  return (
    <GlassCard padding="md" className="h-full flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Tags size={16} style={{ color: "var(--primary)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Categories &amp; Budgets
        </h3>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0">
        {isLoading ? (
          <div className="w-full flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-11 rounded-lg animate-pulse"
                style={{ background: "var(--muted)" }}
              />
            ))}
          </div>
        ) : (
          <CategoryStack categories={categories} />
        )}
      </div>

      <Button
        onClick={() => setDrawerOpen(true)}
        className="h-9 w-full gap-1.5 text-xs font-semibold"
        style={{ background: "var(--muted)", color: "var(--foreground)" }}
      >
        View categories
      </Button>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent>
          <SheetHeader>
            <div className="flex items-center justify-between gap-3 pr-8">
              <div className="flex flex-col gap-1">
                <SheetTitle>Categories &amp; Budgets</SheetTitle>
                <SheetDescription>Browse, edit, or add categories.</SheetDescription>
              </div>
              <CategoryFormDialog
                defaultType={tab}
                trigger={
                  <Button
                    className="h-8 shrink-0 gap-1.5 px-3 text-xs font-semibold"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    <Plus size={14} />
                    Add
                  </Button>
                }
              />
            </div>
          </SheetHeader>

          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as TransactionType)}
            className="flex flex-col flex-1 min-h-0 px-6 pb-6 pt-4 gap-4"
          >
            <TabsList>
              <TabsTrigger value="expense" className="flex items-center justify-center gap-1.5">
                <ArrowDownRight size={13} />
                Expense
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center justify-center gap-1.5">
                <ArrowUpRight size={13} />
                Income
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <TabsContent value="expense">
                <CategoriesTable categories={expense} />
              </TabsContent>
              <TabsContent value="income">
                <CategoriesTable categories={income} />
              </TabsContent>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>
    </GlassCard>
  );
}

// ─── Stacked preview ────────────────────────────────────────────────────────────
// iOS-notification-style stack: top ~3 categories peek out from behind one
// another, with a "+N" badge for the rest. Purely decorative — clicking
// anywhere opens the drawer via the button below.
function CategoryStack({ categories }: { categories: { id: number; name: string; type: TransactionType }[] }) {
  if (categories.length === 0) {
    return (
      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        No categories yet
      </p>
    );
  }

  const visible = categories.slice(0, 3);
  const extra = categories.length - visible.length;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[15rem]" style={{ height: `${64 + (visible.length - 1) * 12}px` }}>
        {visible.map((c, i) => {
          const depth = visible.length - 1 - i;
          return (
            <div
              key={c.id}
              className="absolute inset-x-0 rounded-xl px-4 py-3 flex items-center gap-2"
              style={{
                top: depth * 12,
                left: "50%",
                transform: `translateX(-50%) scale(${1 - depth * 0.06})`,
                zIndex: 10 - depth,
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
                opacity: 1 - depth * 0.25,
                width: `${100 - depth * 6}%`,
              }}
            >
              {c.type === "expense" ? (
                <ArrowDownRight size={13} className="shrink-0 text-rose-400" />
              ) : (
                <ArrowUpRight size={13} className="shrink-0 text-emerald-400" />
              )}
              <span
                className="text-sm capitalize font-medium truncate"
                style={{ color: "var(--foreground)" }}
              >
                {c.name}
              </span>
            </div>
          );
        })}
        {extra > 0 && (
          <span
            className="absolute -top-2 right-1 z-20 rounded-full px-2 py-0.5 text-[0.65rem] font-bold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            +{extra}
          </span>
        )}
      </div>
      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        {categories.length} {categories.length === 1 ? "category" : "categories"}
      </span>
    </div>
  );
}
