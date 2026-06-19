import { getPurchaseOrders, markAsReceived, deletePurchaseOrder } from "../../actions/purchases";
import { PurchaseListClient } from "@repo/ui/PurchaseListClient";

export default async function PurchasesPage() {
  const purchaseOrders = await getPurchaseOrders();
  return (
    <PurchaseListClient
      initialOrders={purchaseOrders}
      markAsReceivedAction={markAsReceived}
      deletePurchaseOrderAction={deletePurchaseOrder}
      currency="AED"
    />
  );
}
