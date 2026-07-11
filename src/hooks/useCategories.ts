import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  Category,
  TransactionType,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";

// ─── API calls ────────────────────────────────────────────────────────────────
const mapCategory = (c: Record<string, unknown>): Category => ({
  id: c.id as number,
  name: c.name as string,
  type: c.type as TransactionType,
  budget: c.budget == null ? null : Number(c.budget),
  spent: Number(c.spent),
  remaining: c.remaining == null ? null : Number(c.remaining),
});

const fetchCategories = async (type?: TransactionType): Promise<Category[]> => {
  const res = await api.get("/categories", { params: type ? { type } : {} });
  return res.data.data.map(mapCategory);
};

const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const res = await api.post("/categories", {
    name: payload.name,
    type: payload.type,
    budget: payload.budget ?? null,
  });
  return mapCategory(res.data.data);
};

const updateCategory = async ({
  id,
  ...payload
}: UpdateCategoryPayload & { id: number }): Promise<Category> => {
  // Only send keys that were explicitly provided so a rename doesn't wipe the
  // budget (the backend keys off which fields are present).
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name;
  if ("budget" in payload) body.budget = payload.budget ?? null;
  const res = await api.patch(`/categories/${id}`, body);
  return mapCategory(res.data.data);
};

const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
// Category edits change budget progress and the ledger's category labels, so we
// refresh transactions + summary alongside the category list.
function useInvalidateCategories() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    qc.invalidateQueries({ queryKey: ["finance-summary"] });
  };
}

export function useCategories(type?: TransactionType) {
  return useQuery({
    queryKey: ["categories", type ?? "all"],
    queryFn: () => fetchCategories(type),
  });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({ mutationFn: createCategory, onSuccess: invalidate });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({ mutationFn: updateCategory, onSuccess: invalidate });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({ mutationFn: deleteCategory, onSuccess: invalidate });
}
