"use client";

import { useRouter } from "next/navigation";
import { updateProduct } from "../../../../actions/product";
import { ProductForm } from "@repo/ui/ProductForm";
import { useToast } from "@repo/ui/Toast";
import { pakistanProductFields } from "../../../../lib/productFields";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku?: string | null;
  brand?: string | null;
  modelNumber?: string | null;
  serialNumber?: string | null;
  voltage?: string | null;
  warrantyMonths?: number | null;
};

type Props = {
  product: Product;
};

export function EditForm({ product }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <ProductForm
      fields={pakistanProductFields}
      submitLabel="Update Product"
      defaultValues={{
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        sku: product.sku,
        brand: product.brand,
        modelNumber: product.modelNumber,
        serialNumber: product.serialNumber,
        voltage: product.voltage,
        warrantyMonths: product.warrantyMonths,
      }}
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
