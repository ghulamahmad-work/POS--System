import type { PrismaClient } from "@prisma/client";

export function createPurchasesService(db: PrismaClient) {
  return {
    getPurchaseOrders: () => {
      return db.purchaseOrder.findMany({
        orderBy: { createdAt: "desc" },
        include: { vendor: true, items: true },
      });
    },

    createPurchaseOrder: async (data: {
      vendorName: string;
      contactPhone?: string;
      totalAmount: number;
      items: { productId: string; quantity: number; unitCost: number }[];
    }) => {
      return db.$transaction(async (tx: any) => {
        // Find or create vendor
        let vendor = await tx.vendor.findFirst({
          where: { name: { equals: data.vendorName } },
        });
        if (!vendor) {
          vendor = await tx.vendor.create({
            data: { name: data.vendorName, contactPhone: data.contactPhone },
          });
        }

        // Create PO
        const po = await tx.purchaseOrder.create({
          data: {
            vendorId: vendor.id,
            status: "pending",
            totalAmount: data.totalAmount,
            items: {
              create: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitCost: item.unitCost,
              })),
            },
          },
          include: {
            vendor: true,
            items: true,
          },
        });
        return po;
      });
    },

    markPurchaseOrderReceived: async (id: string) => {
      return db.$transaction(async (tx: any) => {
        const po = await tx.purchaseOrder.findUnique({
          where: { id },
          include: { items: true },
        });

        if (!po) throw new Error("Purchase Order not found");
        if (po.status === "received") throw new Error("Purchase Order already received");

        // 1. Mark as received
        const updatedPo = await tx.purchaseOrder.update({
          where: { id },
          data: { status: "received" },
        });

        // 2. Increment stock for all items
        for (const item of po.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        return updatedPo;
      });
    },

    deletePurchaseOrder: async (id: string) => {
      return db.$transaction(async (tx: any) => {
        const po = await tx.purchaseOrder.findUnique({
          where: { id },
          include: { items: true },
        });

        if (!po) throw new Error("Purchase Order not found");

        if (po.status === "received") {
          for (const item of po.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }

        await tx.purchaseOrderItem.deleteMany({
          where: { purchaseOrderId: id },
        });

        return tx.purchaseOrder.delete({
          where: { id },
        });
      });
    },
  };
}
