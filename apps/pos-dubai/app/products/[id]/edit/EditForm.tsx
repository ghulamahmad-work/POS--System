"use client";

import { useRouter } from "next/navigation";
import { updateProduct } from "../../../../actions/product";
import { ProductForm } from "@repo/ui/ProductForm";
import { useToast } from "@repo/ui/Toast";
import { dubaiProductFields } from "../../../../lib/productFields";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku?: string | null;
  unitOfMeasure?: string | null;
  unitQuantity?: number | null;
  expiryDate?: Date | null;
  weightGrams?: number | null;
};

type Props = {
  product: Product;
};

export function EditForm({ product }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues: Record<string, string | number | null | undefined> = {
    name: product.name,
    price: product.price,
    stock: product.stock,
    category: product.category,
    sku: product.sku,
expiryDate: product.expiryDate ? product.expiryDate.toISOString().split("T")[0] : null,    unitOfMeasure: product.unitOfMeasure ?? (product.weightGrams ? "g" : ""),
    unitQuantity: product.unitQuantity ?? product.weightGrams,
  };

  return (
    <ProductForm
      fields={dubaiProductFields}
      submitLabel="Update Product"
      defaultValues={defaultValues}
      onSubmit={(formData) => updateProduct(product.id, formData)}
      onSuccess={() => {
        toast("Product updated successfully.", "success");
        router.push("/products");
        router.refresh();
      }}
      onError={() => toast("Failed to update product.", "danger")}
    />
  );
}
