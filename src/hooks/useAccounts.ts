import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  Account,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/types";

// ─── API calls ────────────────────────────────────────────────────────────────
const mapAccount = (a: Record<string, unknown>): Account => ({
  id: a.id as number,
  name: a.name as string,
  openingBalance: Number(a.opening_balance),
  isDefault: Boolean(a.is_default),
  balance: Number(a.balance),
});

const fetchAccounts = async (): Promise<Account[]> => {
  const res = await api.get("/accounts");
  return res.data.data.map(mapAccount);
};

const createAccount = async (payload: CreateAccountPayload): Promise<Account> => {
  const res = await api.post("/accounts", {
    name: payload.name,
    opening_balance: payload.openingBalance,
  });
  return mapAccount(res.data.data);
};

const updateAccount = async ({
  id,
  ...payload
}: UpdateAccountPayload & { id: number }): Promise<Account> => {
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.openingBalance !== undefined)
    body.opening_balance = payload.openingBalance;
  const res = await api.patch(`/accounts/${id}`, body);
  return mapAccount(res.data.data);
};

const deleteAccount = async (id: number): Promise<void> => {
  await api.delete(`/accounts/${id}`);
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
// Account mutations ripple into transactions/summary (deleting an account
// reassigns its transactions to Cash), so we invalidate the whole finance space.
function useInvalidateAccounts() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["accounts"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    qc.invalidateQueries({ queryKey: ["finance-summary"] });
  };
}

export function useAccounts() {
  return useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });
}

export function useCreateAccount() {
  const invalidate = useInvalidateAccounts();
  return useMutation({ mutationFn: createAccount, onSuccess: invalidate });
}

export function useUpdateAccount() {
  const invalidate = useInvalidateAccounts();
  return useMutation({ mutationFn: updateAccount, onSuccess: invalidate });
}

export function useDeleteAccount() {
  const invalidate = useInvalidateAccounts();
  return useMutation({ mutationFn: deleteAccount, onSuccess: invalidate });
}
