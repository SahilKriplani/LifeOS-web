"use client";

import { Button } from "@/components/ui/button";
import CategoryFormDialog from "@/components/finance/CategoryFormDialog";
import { useDeleteCategory } from "@/hooks/useCategories";
import type { Category } from "@/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const PAGE_SIZE = 5;

export default function CategoriesTable({ categories }: { categories: Category[] }) {
  const del = useDeleteCategory();
  const isExpense = categories[0]?.type === "expense";

  const handleDelete = (c: Category) =>
    del.mutate(c.id, {
      onSuccess: () => toast.success(`Deleted ${c.name}`),
      onError: () => toast.error("Failed to delete category"),
    });

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span
          className="text-sm capitalize font-medium truncate block max-w-[9rem]"
          style={{ color: "var(--foreground)" }}
        >
          {row.original.name}
        </span>
      ),
    },
    ...(isExpense
      ? [
          {
            id: "budget",
            header: "Budget",
            cell: ({ row }: { row: { original: Category } }) => {
              const c = row.original;
              const hasBudget = c.budget != null && c.budget > 0;
              return (
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {hasBudget ? `${money(c.spent)} / ${money(c.budget!)}` : "No budget"}
                </span>
              );
            },
          } satisfies ColumnDef<Category>,
        ]
      : []),
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <CategoryFormDialog
              category={c}
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
              onClick={() => handleDelete(c)}
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "rgba(244,63,94,0.12)", color: "#f43f5e" }}
              aria-label="Delete category"
            >
              <Trash2 size={11} />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  if (categories.length === 0) {
    return (
      <p className="text-xs py-6 text-center" style={{ color: "var(--muted-foreground)" }}>
        None yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="grid items-center gap-2 rounded-lg px-3 py-2.5"
            style={{
              background: "var(--muted)",
              gridTemplateColumns: isExpense ? "1fr auto auto" : "1fr auto",
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <div key={cell.id} className="min-w-0">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[0.7rem]" style={{ color: "var(--muted-foreground)" }}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
