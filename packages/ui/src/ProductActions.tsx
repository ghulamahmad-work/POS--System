"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "./Toast";
import { ConfirmDialog } from "./ConfirmDialog";

type Props = {
  productId: string;
  deleteAction: (id: string) => Promise<void>;
};

export function ProductActions({ productId, deleteAction }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAction(productId);
      toast("Product deleted successfully.", "success");
    } catch {
      toast("Failed to delete product.", "danger");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <Link
          href={`/products/${productId}/edit`}
          className="font-medium text-[var(--brand-600)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
        >
          Edit
        </Link>
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="font-medium text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Delete
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}
