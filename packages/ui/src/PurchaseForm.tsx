"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";
import { Button } from "./Button";
import { formatCurrency } from "./formatCurrency";

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
  const { toast } = useToast();
  const [vendorName, setVendorName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast("Please enter a vendor name and add at least one item.", "warning");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createPurchaseOrderAction({ vendorName, contactPhone, totalAmount, items });
      toast("Purchase order created successfully.", "success");
      router.push("/purchases");
      router.refresh();
    } catch {
      toast("Failed to create purchase order.", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
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
          <Button variant="ghost" type="button" onClick={addItem}>
            + Add Item
          </Button>
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
              <div className="w-28 pb-2 text-right font-medium tabular-nums">
                {formatCurrency(item.quantity * item.unitCost, currency)}
              </div>
              <Button
                variant="ghost"
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))
        )}

        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
          <div className="text-xl">
            <span className="text-gray-500 mr-2">Total:</span>
            <span className="font-bold text-gray-900 tabular-nums">{formatCurrency(totalAmount, currency)}</span>
          </div>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={items.length === 0 || !vendorName}
          >
            Create Purchase Order
          </Button>
        </div>
      </form>
    </div>
  );
}
