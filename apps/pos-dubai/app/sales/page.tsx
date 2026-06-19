import { getProducts } from "../../actions/product";
import { checkout } from "../../actions/sales";
import { SalesClient } from "@repo/ui/SalesClient";

export default async function SalesPage() {
  const products = await getProducts();
  return (
    <SalesClient
      initialProducts={products}
      taxRate={0.05}
      taxLabel="VAT"
      currency="AED"
      checkoutAction={checkout}
    />
  );
}
