import Link from "next/link";
import { getPurchaseOrders, markAsReceived, deletePurchaseOrder } from "../../actions/purchases";
import { PurchaseListClient } from "@repo/ui/PurchaseListClient";
import { AppFrame } from "../AppFrame";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const purchaseOrders = await getPurchaseOrders();

  return (
    <AppFrame
      pageTitle="Purchases"
      headerActions={
        <Link
          href="/purchases/new"
          className="inline-flex h-10 items-center rounded-md bg-[var(--brand-600)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
        >
          New Order
        </Link>
      }
    >
      <PurchaseListClient
        initialOrders={purchaseOrders}
        markAsReceivedAction={markAsReceived}
        deletePurchaseOrderAction={deletePurchaseOrder}
        currency="PKR"
      />
    </AppFrame>
  );
}
