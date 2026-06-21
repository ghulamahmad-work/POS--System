import { getProductById } from "../../../../actions/product";
import { notFound } from "next/navigation";
import { EditForm } from "./EditForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className="p-6 max-w-md mx-auto mt-8 bg-[var(--panel)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
      <h1 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Edit Product</h1>
      <EditForm product={product as any} />
    </div>
  );
}
