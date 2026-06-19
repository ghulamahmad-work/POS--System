import { getPurchaseOrders, markAsReceived, deletePurchaseOrder } from "../../actions/purchases";
import { PurchaseListClient } from "@repo/ui/PurchaseListClient";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const purchaseOrders = await getPurchaseOrders();
  return (
    <PurchaseListClient
      initialOrders={purchaseOrders}
      markAsReceivedAction={markAsReceived}
      deletePurchaseOrderAction={deletePurchaseOrder}
      currency="₨"
    />
  );
}
