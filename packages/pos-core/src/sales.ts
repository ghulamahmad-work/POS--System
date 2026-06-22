import { revalidatePath } from "next/cache";

export function createSalesActions(salesService: any) {
  return {
    async checkout(cartData: {
      totalAmount: number;
      taxAmount: number;
      paymentType: string;
      items: {
        productId: string;
        quantity: number;
        unitPrice: number;
      }[];
    }) {
      await salesService.createSale(cartData);

      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/sales");
      revalidatePath("/reports");
    },
  };
}