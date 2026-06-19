import { getProducts } from "../../../actions/product";
import { createPurchaseOrder } from "../../../actions/purchases";
import { PurchaseForm } from "@repo/ui/PurchaseForm";

export const dynamic = "force-dynamic";

export default async function NewPurchasePage() {
  const products = await getProducts();
  return (
    <PurchaseForm
      products={products}
      currency="AED"
      createPurchaseOrderAction={createPurchaseOrder}
    />
  );
}
