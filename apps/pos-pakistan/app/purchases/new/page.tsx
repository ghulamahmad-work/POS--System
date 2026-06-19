import { getProducts } from "../../../actions/product";
import { createPurchaseOrder } from "../../../actions/purchases";
import { PurchaseForm } from "@repo/ui/PurchaseForm";

export default async function NewPurchasePage() {
  const products = await getProducts();
  return (
    <PurchaseForm
      products={products}
      currency="₨"
      createPurchaseOrderAction={createPurchaseOrder}
    />
  );
}
