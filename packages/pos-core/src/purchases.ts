import { revalidatePath } from "next/cache";

export function createPurchasesActions(purchasesService: any) {
  return {
    async getPurchaseOrders() {
      return purchasesService.getPurchaseOrders();
    },

    async createPurchaseOrder(
      data: {
        vendorName: string;
        contactPhone?: string;
        totalAmount: number;
        items: { productId: string; quantity: number; unitCost: number }[];
      }
    ) {
      await purchasesService.createPurchaseOrder(data);
      revalidatePath("/");
      revalidatePath("/purchases");
      revalidatePath("/reports");
    },

    async markAsReceived(id: string) {
      await purchasesService.markPurchaseOrderReceived(id);
      revalidatePath("/");
      revalidatePath("/purchases");
      revalidatePath("/products");
      revalidatePath("/reports");
    },

    async deletePurchaseOrder(id: string) {
      await purchasesService.deletePurchaseOrder(id);
      revalidatePath("/");
      revalidatePath("/purchases");
      revalidatePath("/products");
      revalidatePath("/reports");
    },
  };
}
