"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import { useToast } from "./Toast";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { formatCurrency } from "./formatCurrency";

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
  const { toast } = useToast();
  
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; id: string | null; status: string | null; loading: boolean }>({
    isOpen: false,
    id: null,
    status: null,
    loading: false
  });

  const handleMarkReceived = async (id: string) => {
    try {
      await markAsReceivedAction(id);
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: "received" } : o)));
      toast("Order marked as received! Stock has been updated.", "success");
    } catch {
      toast("Failed to update order status.", "danger");
    }
  };

  const handleDeleteRequest = (id: string, status: string) => {
    setConfirmState({ isOpen: true, id, status, loading: false });
  };

  const executeDelete = async () => {
    if (!confirmState.id) return;
    setConfirmState(prev => ({ ...prev, loading: true }));
    try {
      await deletePurchaseOrderAction(confirmState.id);
      setOrders(prev => prev.filter(o => o.id !== confirmState.id));
      toast("Purchase order deleted.", "success");
    } catch {
      toast("Failed to delete purchase order.", "danger");
    } finally {
      setConfirmState({ isOpen: false, id: null, status: null, loading: false });
    }
  };

  const confirmMessage = confirmState.status === "received"
    ? "This order was already received. Deleting it will reverse the stock changes. Continue?"
    : "Are you sure you want to delete this purchase order?";

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-(--border-subtle) bg-(--panel) shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-(--text-muted) py-8">
                    No purchase orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map(po => (
                  <TableRow key={po.id}>
                    <TableCell>
                      <div className="font-medium text-(--text-primary)">{po.vendor?.name}</div>
                      <div className="text-sm text-(--text-muted)">{po.vendor?.contactPhone}</div>
                    </TableCell>
                    <TableCell>{(po.items as unknown[])?.length ?? 0}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(po.totalAmount, currency)}</TableCell>
                    <TableCell>
                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          po.status === "received"
                            ? "border-emerald-200 bg-transparent text-emerald-700"
                              : "border-amber-200 bg-transparent text-amber-700",
                        ].join(" ")}
                      >
                        {po.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-(--text-muted)">
                      {new Date(po.createdAt).toLocaleDateString("en-US")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {po.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkReceived(po.id)}
                          className="text-(--brand-600)"
                        >
                          Receive
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRequest(po.id, po.status)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-(--border-subtle)">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-sm text-(--text-muted)">
              No purchase orders found.
            </div>
          ) : (
            orders.map(po => (
              <div key={po.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-(--text-primary) truncate">{po.vendor?.name}</p>
                    <p className="text-xs text-(--text-muted) mt-0.5">{po.vendor?.contactPhone}</p>
                  </div>
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0",
                      po.status === "received"
                        ? "border-emerald-200 bg-transparent text-emerald-700"
                        : "border-amber-200 bg-transparent text-amber-700",
                    ].join(" ")}
                  >
                    {po.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-(--text-muted)">Items:</span>
                    <p className="font-semibold tabular-nums text-(--text-primary)">{(po.items as unknown[])?.length ?? 0}</p>
                  </div>
                  <div>
                    <span className="text-(--text-muted)">Total:</span>
                    <p className="font-semibold tabular-nums text-(--text-primary)">{formatCurrency(po.totalAmount, currency)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-(--text-muted)">Date:</span>
                    <p className="text-(--text-primary)">{new Date(po.createdAt).toLocaleDateString("en-US")}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  {po.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkReceived(po.id)}
                      className="flex-1 text-(--brand-600)"
                    >
                      Receive
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRequest(po.id, po.status)}
                    className="flex-1 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete Purchase Order"
        description={confirmMessage}
        confirmLabel="Delete"
        isDestructive
        loading={confirmState.loading}
        onConfirm={executeDelete}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
