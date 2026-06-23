import { getProducts } from "../../actions/product";
import { checkout } from "../../actions/sales";
import { SalesClient } from "@repo/ui/SalesClient";
import { AppFrame } from "../AppFrame";

export const revalidate = 60;

export default async function CheckoutPage() {
  const products = await getProducts();

  return (
    <AppFrame pageTitle="Checkout">
      <SalesClient
        initialProducts={products}
        taxRate={0.17}
        taxLabel="GST"
        currency="PKR"
        checkoutAction={checkout}
      />
    </AppFrame>
  );
}