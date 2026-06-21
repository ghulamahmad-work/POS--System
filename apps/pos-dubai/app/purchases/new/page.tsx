import { getProducts } from "../../../actions/product";
import { createPurchaseOrder } from "../../../actions/purchases";
import { PurchaseForm } from "@repo/ui/PurchaseForm";
import { AppFrame } from "../../AppFrame";

export const dynamic = "force-dynamic";

export default async function NewPurchasePage() {
  const products = await getProducts();

  return (
    <AppFrame pageTitle="New Purchase Order">
      <PurchaseForm
        products={products}
        currency="AED"
        createPurchaseOrderAction={createPurchaseOrder}
      />
    </AppFrame>
  );
}
