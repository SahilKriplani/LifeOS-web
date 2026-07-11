import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  FinanceSummary,
} from "@/types";

// ─── API calls ────────────────────────────────────────────────────────────────
const mapTransaction = (t: Record<string, unknown>): Transaction => ({
  id: t.id as number,
  userId: t.user_id as number,
  type: t.type as Transaction["type"],
  amount: Number(t.amount),
  accountId: t.account_id as number,
  accountName: (t.account_name as string) ?? null,
  categoryId: (t.category_id as number) ?? null,
  categoryName: (t.category_name as string) ?? null,
  note: (t.note as string) ?? null,
  date: t.date as string,
});

const fetchTransactions = async (): Promise<Transaction[]> => {
  const res = await api.get("/transactions");
  return res.data.data.map(mapTransaction);
};

const fetchSummary = async (days = 30): Promise<FinanceSummary> => {
  const res = await api.get(`/transactions/summary?days=${days}`);
  const d = res.data.data;
  return {
    totalIncome: Number(d.total_income),
    totalExpense: Number(d.total_expense),
    balance: Number(d.balance),
    byCategory: (d.by_category ?? []).map((c: Record<string, unknown>) => ({
      category: c.category as string,
      total: Number(c.total),
    })),
    daily: (d.daily ?? []).map((p: Record<string, unknown>) => ({
      date: p.date as string,
      income: Number(p.income),
      expense: Number(p.expense),
    })),
  };
};

const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<Transaction> => {
  const res = await api.post("/transactions", {
    type: payload.type,
    amount: payload.amount,
    account_id: payload.accountId,
    category_id: payload.categoryId ?? null,
    note: payload.note ?? null,
    date: payload.date,
  });
  return mapTransaction(res.data.data);
};

const updateTransaction = async ({
  id,
  ...payload
}: UpdateTransactionPayload & { id: number }): Promise<Transaction> => {
  const body: Record<string, unknown> = {};
  if (payload.type !== undefined) body.type = payload.type;
  if (payload.amount !== undefined) body.amount = payload.amount;
  if (payload.accountId !== undefined) body.account_id = payload.accountId;
  if ("categoryId" in payload) body.category_id = payload.categoryId ?? null;
  if ("note" in payload) body.note = payload.note ?? null;
  if (payload.date !== undefined) body.date = payload.date;
  const res = await api.patch(`/transactions/${id}`, body);
  return mapTransaction(res.data.data);
};

const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
}

export function useFinanceSummary(days = 30) {
  return useQuery({
    queryKey: ["finance-summary", days],
    queryFn: () => fetchSummary(days),
  });
}

// A transaction touches everything: the ledger, the summary chart, account
// balances, and category budget spend — so every mutation invalidates them all.
function useInvalidateFinance() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["finance-summary"] });
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };
}

export function useCreateTransaction() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: invalidate,
  });
}

export function useUpdateTransaction() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: invalidate,
  });
}
