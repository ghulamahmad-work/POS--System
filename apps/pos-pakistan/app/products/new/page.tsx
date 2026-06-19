import { createProduct } from "../../../actions/product";

export default function NewProductPage() {
  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>
      <form action={createProduct} className="flex flex-col gap-4">
        <input name="name" placeholder="Name" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand" required />
        <input name="price" type="number" step="0.01" placeholder="Price" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand" required />
        <input name="stock" type="number" placeholder="Stock" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand" required />
        <input name="category" placeholder="Category" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand" required />
        <input name="voltage" placeholder="Voltage (e.g. 220V)" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand" />
        <input name="warrantyMonths" type="number" placeholder="Warranty (months)" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand" />
        <button type="submit" className="bg-brand text-brandText p-2 rounded font-medium hover:opacity-90 transition-opacity">
          Save Product
        </button>
      </form>
    </div>
  );
}