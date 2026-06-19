"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = { id: string; name: string; price: number; stock: number; category: string };
type LineItem = { productId: string; quantity: number; unitCost: number };

type CreatePurchaseOrderData = {
  vendorName: string;
  contactPhone?: string;
  totalAmount: number;
  items: LineItem[];
};

type Props = {
  products: Product[];
  currency: string;
  createPurchaseOrderAction: (data: CreatePurchaseOrderData) => Promise<void>;
};

export function PurchaseForm({ products, currency, createPurchaseOrderAction }: Props) {
  const router = useRouter();
  const [vendorName, setVendorName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  const addItem = () => {
    const first = products[0];
    if (first) {
      setItems(prev => [...prev, { productId: first.id, quantity: 1, unitCost: 0 }]);
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || items.length === 0) {
      alert("Please enter a vendor name and add at least one item.");
      return;
    }
    try {
      await createPurchaseOrderAction({ vendorName, contactPhone, totalAmount, items });
      alert("Purchase order created successfully.");
      router.push("/purchases");
      router.refresh();
    } catch {
      alert("Failed to create purchase order.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">New Purchase Order</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
            <input
              required
              type="text"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand"
              value={vendorName}
              onChange={e => setVendorName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold">Line Items</h2>
          <button type="button" onClick={addItem} className="text-brand hover:underline font-medium">
            + Add Item
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 mb-6">No items added yet.</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex gap-4 mb-4 items-end bg-gray-50 p-4 rounded border">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded"
                  value={item.productId}
                  onChange={e => updateItem(index, "productId", e.target.value)}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={item.quantity === 0 ? "" : item.quantity}
                  onChange={e => {
                    const val = e.target.value;
                    updateItem(index, "quantity", val === "" ? 0 : parseInt(val, 10));
                  }}
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-gray-500 mb-1">Unit Cost</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded"
                  // FIX: If cost is zero or empty, show empty string to allow seamless typing
                  value={item.unitCost === 0 ? "" : item.unitCost}
                  onChange={e => {
                    const val = e.target.value;
                    updateItem(index, "unitCost", val === "" ? 0 : parseFloat(val));
                  }}
                />
              </div>
              <div className="w-28 pb-2 text-right font-medium">
                {currency} {(item.quantity * item.unitCost).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="pb-2 text-red-500 hover:underline text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))
        )}

        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
          <div className="text-xl">
            <span className="text-gray-500 mr-2">Total:</span>
            <span className="font-bold text-gray-900"> {currency} {totalAmount.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={items.length === 0 || !vendorName}
            className="bg-brand text-brandText px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Purchase Order
          </button>
        </div>
      </form>
    </div>
  );
}
