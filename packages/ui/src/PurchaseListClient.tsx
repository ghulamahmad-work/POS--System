"use client";

import { useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date | string;
  vendor?: { name: string; contactPhone?: string | null };
  items?: unknown[];
};

type Props = {
  initialOrders: Order[];
  markAsReceivedAction: (id: string) => Promise<void>;
  deletePurchaseOrderAction: (id: string) => Promise<void>;
  currency: string;
};

export function PurchaseListClient({
  initialOrders,
  markAsReceivedAction,
  deletePurchaseOrderAction,
  currency,
}: Props) {
  const [orders, setOrders] = useState(initialOrders);

  const handleMarkReceived = async (id: string) => {
    try {
      await markAsReceivedAction(id);
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: "received" } : o)));
      alert("Order marked as received! Stock has been updated.");
    } catch {
      alert("Failed to update order status.");
    }
  };

  const handleDelete = async (id: string, status: string) => {
    const message =
      status === "received"
        ? "This order was already received. Deleting it will reverse the stock changes. Continue?"
        : "Are you sure you want to delete this purchase order?";
    if (!window.confirm(message)) return;

    try {
      await deletePurchaseOrderAction(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch {
      alert("Failed to delete purchase order.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <Link
          href="/purchases/new"
          className="bg-brand text-brandText px-4 py-2 rounded shadow hover:opacity-90"
        >
          + New Order
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Vendor</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No purchase orders found.
                </td>
              </tr>
            ) : (
              orders.map(po => (
                <tr key={po.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{po.vendor?.name}</div>
                    <div className="text-sm text-gray-500">{po.vendor?.contactPhone}</div>
                  </td>
                  <td className="p-4">{(po.items as unknown[])?.length ?? 0}</td>
                  <td className="p-4">{currency}{po.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${po.status === "received" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {po.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(po.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    {po.status === "pending" && (
                      <button
                        onClick={() => handleMarkReceived(po.id)}
                        className="text-brand hover:underline font-medium"
                      >
                        Mark Received
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(po.id, po.status)}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
