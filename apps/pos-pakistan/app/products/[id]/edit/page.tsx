import { getProductById } from "../../../../actions/product";
import { notFound } from "next/navigation";
import { EditForm } from "./EditForm";
import { AppFrame } from "../../../AppFrame";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <AppFrame pageTitle="Edit Product">
      <div className="max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--panel)] p-6 shadow-sm">
        <EditForm product={product} />
      </div>
    </AppFrame>
  );
}
