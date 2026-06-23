"use client";

import { useRouter } from "next/navigation";
import { createProduct } from "../../../actions/product";
import { ProductForm } from "@repo/ui/ProductForm";
import { useToast } from "@repo/ui/Toast";
import { pakistanProductFields } from "../../../lib/productFields";

export function NewProductClient() {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <ProductForm
      fields={pakistanProductFields}
      submitLabel="Save Product"
      onSubmit={createProduct}
      onSuccess={() => {
        toast("Product added successfully.", "success");
        router.push("/products");
        router.refresh();
      }}
      onError={() => toast("Failed to add product.", "danger")}
    />
  );
}
