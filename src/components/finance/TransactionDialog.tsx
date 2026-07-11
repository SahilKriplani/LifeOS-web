"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTodayISO } from "@/lib/utils";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTransaction } from "@/hooks/useFinance";
import type { TransactionType } from "@/types";
import toast from "react-hot-toast";

// ─── Shared transaction entry ───────────────────────────────────────────────
// One modal used everywhere (dashboard quick-add + finance page) so the entry
// experience is identical. Captures amount, account, category, note and date.
export default function TransactionDialog({
  trigger,
  defaultType = "expense",
}: {
  trigger: React.ReactNode;
  defaultType?: TransactionType;
}) {
  const [open, setOpen] = useState(false);

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const createTxn = useCreateTransaction();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(getTodayISO());

  const typeCategories = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type],
  );

  // Derive the effective selections instead of syncing them through effects:
  // fall back to the default (Cash) account, and keep the category valid as the
  // type flips. User picks (non-empty state) always win.
  const resolvedAccountId =
    accountId ||
    (accounts.find((a) => a.isDefault) ?? accounts[0])?.id?.toString() ||
    "";
  const resolvedCategoryId = typeCategories.some(
    (c) => String(c.id) === categoryId,
  )
    ? categoryId
    : typeCategories.length
      ? String(typeCategories[0].id)
      : "";

  const reset = () => {
    setAmount("");
    setNote("");
    setDate(getTodayISO());
  };

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error("Enter an amount greater than 0");
      return;
    }
    if (!resolvedAccountId) {
      toast.error("Pick an account");
      return;
    }
    createTxn.mutate(
      {
        type,
        amount: value,
        accountId: Number(resolvedAccountId),
        categoryId: resolvedCategoryId ? Number(resolvedCategoryId) : null,
        note: note.trim() || null,
        date,
      },
      {
        onSuccess: () => {
          toast.success(`${type === "income" ? "Income" : "Expense"} added`);
          reset();
          setOpen(false);
        },
        onError: () => toast.error("Failed to add transaction"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="p-6 flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Add transaction</DialogTitle>
            <DialogDescription>
              Log an income or expense against one of your accounts.
            </DialogDescription>
          </DialogHeader>

          {/* Type toggle */}
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

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                inputMode="decimal"
                placeholder="0"
                autoFocus
              />
            </Field>
            <Field label="Date">
              <DatePicker value={date} onChange={setDate} max={getTodayISO()} />
            </Field>
          </div>

          {/* Account + Category */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Account">
              <Select value={resolvedAccountId} onValueChange={setAccountId}>
                <SelectTrigger className="!h-9 !rounded-lg w-full">
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Category">
              <Select
                value={resolvedCategoryId}
                onValueChange={setCategoryId}
                disabled={typeCategories.length === 0}
              >
                <SelectTrigger className="!h-9 !rounded-lg w-full capitalize">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {typeCategories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)} className="capitalize">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Note */}
          <Field label="Note (optional)">
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. lunch with team"
              maxLength={255}
            />
          </Field>

          <Button
            onClick={handleSubmit}
            disabled={createTxn.isPending}
            className="h-9 w-full font-semibold"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {createTxn.isPending ? "Adding…" : "Add transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </Label>
      {children}
    </div>
  );
}
