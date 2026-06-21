"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import { Badge } from "./Badge";
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
      <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--panel)] shadow-sm">
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
                <TableCell colSpan={6} className="text-center text-[var(--text-muted)] py-8">
                  No purchase orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map(po => (
                <TableRow key={po.id}>
                  <TableCell>
                    <div className="font-medium text-[var(--text-primary)]">{po.vendor?.name}</div>
                    <div className="text-sm text-[var(--text-muted)]">{po.vendor?.contactPhone}</div>
                  </TableCell>
                  <TableCell>{(po.items as unknown[])?.length ?? 0}</TableCell>
                  <TableCell className="tabular-nums">{formatCurrency(po.totalAmount, currency)}</TableCell>
                  <TableCell>
                    <Badge variant={po.status === "received" ? "success" : "warning"}>
                      {po.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[var(--text-muted)]">
                    {new Date(po.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {po.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkReceived(po.id)}
                        className="text-[var(--brand-600)]"
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
