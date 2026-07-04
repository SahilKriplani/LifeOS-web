"use client";

import { useState } from "react";
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
import { Wallet, Plus, Pencil, Trash2, Lock } from "lucide-react";
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "@/hooks/useAccounts";
import type { Account } from "@/types";
import toast from "react-hot-toast";

const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

// ─── Accounts ────────────────────────────────────────────────────────────────
// The user segregates money into named buckets (Cash, Bank, Wallet…). Balances
// are derived server-side. "Cash" is seeded and undeletable.
export default function AccountsSection() {
  const { data: accounts = [], isLoading } = useAccounts();
  const deleteAccount = useDeleteAccount();

  const handleDelete = (a: Account) => {
    deleteAccount.mutate(a.id, {
      onSuccess: () => toast.success(`Deleted ${a.name}`),
      onError: () => toast.error("Failed to delete account"),
    });
  };

  return (
    <GlassCard padding="md" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={16} style={{ color: "var(--primary)" }} />
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Accounts
          </h3>
        </div>
        <AccountFormDialog
          trigger={
            <Button
              className="h-8 gap-1.5 px-3 text-xs font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <Plus size={14} />
              New account
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-11 rounded-lg animate-pulse"
              style={{ background: "var(--muted)" }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5"
              style={{ background: "var(--muted)" }}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--foreground)" }}
                >
                  {a.name}
                </span>
                {a.isDefault && (
                  <Lock size={10} style={{ color: "var(--muted-foreground)" }} />
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Hover actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AccountFormDialog
                    account={a}
                    trigger={
                      <button
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{
                          background: "var(--glass-bg)",
                          color: "var(--muted-foreground)",
                        }}
                        aria-label="Edit account"
                      >
                        <Pencil size={11} />
                      </button>
                    }
                  />
                  {!a.isDefault && (
                    <button
                      onClick={() => handleDelete(a)}
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ background: "rgba(244,63,94,0.12)", color: "#f43f5e" }}
                      aria-label="Delete account"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: a.balance < 0 ? "#fb7185" : "var(--foreground)" }}
                >
                  {money(a.balance)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

// ─── Create / edit account dialog ──────────────────────────────────────────────
function AccountFormDialog({
  trigger,
  account,
}: {
  trigger: React.ReactNode;
  account?: Account;
}) {
  const isEdit = !!account;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(account?.name ?? "");
  const [opening, setOpening] = useState(
    account ? String(account.openingBalance) : "",
  );

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const pending = createAccount.isPending || updateAccount.isPending;

  // Reset the form to the account's values each time the dialog opens.
  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setName(account?.name ?? "");
      setOpening(account ? String(account.openingBalance) : "");
    }
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Enter an account name");
      return;
    }
    const openingValue = parseFloat(opening) || 0;

    if (isEdit) {
      updateAccount.mutate(
        { id: account!.id, name: trimmed, openingBalance: openingValue },
        {
          onSuccess: () => {
            toast.success("Account updated");
            setOpen(false);
          },
          onError: () => toast.error("Failed to update account"),
        },
      );
    } else {
      createAccount.mutate(
        { name: trimmed, openingBalance: openingValue },
        {
          onSuccess: () => {
            toast.success("Account created");
            setOpen(false);
          },
          onError: () => toast.error("Failed to create account"),
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
            <DialogTitle>{isEdit ? "Edit account" : "New account"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Rename or adjust the opening balance."
                : "Create a bucket to segregate your money."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="e.g. Bank, Wallet, Savings"
              autoFocus
              maxLength={50}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Opening balance
            </Label>
            <Input
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              inputMode="decimal"
              placeholder="0"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={pending}
            className="h-9 w-full font-semibold"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
