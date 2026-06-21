"use client";

import { useRouter } from "next/navigation";
import { createProduct } from "../../../actions/product";
import { ProductForm } from "@repo/ui/ProductForm";
import { useToast } from "@repo/ui/Toast";
import { dubaiProductFields } from "../../../lib/productFields";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <div className="p-6 max-w-lg mx-auto mt-8 bg-[var(--panel)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
      <h1 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Add New Product</h1>
      <ProductForm
        fields={dubaiProductFields}
        submitLabel="Save Product"
        onSubmit={createProduct}
        onSuccess={() => {
          toast("Product added successfully.", "success");
          router.push("/products");
          router.refresh();
        }}
        onError={() => toast("Failed to add product.", "danger")}
      />
    </div>
  );
}
