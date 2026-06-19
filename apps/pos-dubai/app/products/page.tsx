import { getProducts, deleteProduct } from "../../actions/product";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/products/new"
          className="bg-brand text-brandText px-4 py-2 rounded-lg"
        >
          Add Product
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Category</th>
            <th className="p-2">Weight</th>
            <th className="p-2">Expiration Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: (typeof products)[number]) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">{p.weightGrams} g</td>
              <td className="p-1">
                {p.expiryDate
                  ? new Date(p.expiryDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="p-2 flex gap-2 items-center">
                <Link
                  href={`/products/${p.id}/edit`}
                  className="text-brand hover:underline font-medium"
                >
                  Edit
                </Link>
                <form action={deleteProduct.bind(null, p.id)}>
                  <button
                    type="submit"
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
