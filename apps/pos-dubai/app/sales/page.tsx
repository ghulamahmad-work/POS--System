import { getProducts } from "../../actions/product";
import { checkout } from "../../actions/sales";
import { SalesClient } from "@repo/ui/SalesClient";
import { AppFrame } from "../AppFrame";

export const revalidate = 60;

export default async function SalesPage() {
  const products = await getProducts();

  return (
    <AppFrame pageTitle="Sales">
      <SalesClient
        initialProducts={products}
        taxRate={0.05}
        taxLabel="VAT"
        currency="AED"
        checkoutAction={checkout}
      />
    </AppFrame>
  );
}
