import { getProductById, updateProduct } from "../../../../actions/product";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <form action={updateProduct.bind(null, product.id)} className="space-y-4">
        <input
          name="name"
          defaultValue={product.name}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand w-full"
          placeholder="Name"
        />

        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand w-full"
        />

        <input
          name="stock"
          type="number"
          defaultValue={product.stock}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand w-full"
        />

        <input
          name="category"
          defaultValue={product.category}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand w-full"
        />

        <input
          name="expiryDate"
          type="date"
          defaultValue={
            product.expiryDate
              ? new Date(product.expiryDate).toISOString().split("T")[0]
              : ""
          }
          className="border border-gray-300 p-2 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand w-full"
        />

        <input
          name="weightGrams"
          type="number"
          defaultValue={product.weightGrams ?? ""}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand w-full"
          placeholder="Weight (grams)"
        />

        <button className="bg-brand text-brandText px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity">
          Update Product
        </button>
      </form>
    </div>
  );
}
