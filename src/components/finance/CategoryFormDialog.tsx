"use client";

import { useState } from "react";
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
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import type { Category, TransactionType } from "@/types";
import toast from "react-hot-toast";

// ─── Create / edit category dialog ─────────────────────────────────────────────
export default function CategoryFormDialog({
  trigger,
  category,
  defaultType = "expense",
}: {
  trigger: React.ReactNode;
  category?: Category;
  defaultType?: TransactionType;
}) {
  const isEdit = !!category;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name ?? "");
  const [type, setType] = useState<TransactionType>(category?.type ?? defaultType);
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
      setType(category?.type ?? defaultType);
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
