type PurchaseOrderInput = {
  vendorName: string;
  contactPhone?: string;
  totalAmount: number;
  items: { productId: string; quantity: number; unitCost: number }[];
};

type PurchaseTransactionDb = {
  purchaseOrder: {
    findMany: (args?: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };
  purchaseOrderItem: {
    deleteMany: (args: any) => Promise<any>;
  };
  product: {
    update: (args: any) => Promise<any>;
  };
};

type PurchasesDb = PurchaseTransactionDb & {
  $transaction: <T>(
    callback: (tx: PurchaseTransactionDb) => Promise<T>,
  ) => Promise<T>;
};

export function createPurchasesService(db: PurchasesDb) {
  return {
    getPurchaseOrders: () =>
      db.purchaseOrder.findMany({
        include: {
          vendor: true,
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),

    createPurchaseOrder: (data: PurchaseOrderInput) =>
      db.purchaseOrder.create({
        data: {
          totalAmount: data.totalAmount,
          vendor: {
            create: {
              name: data.vendorName,
              contactPhone: data.contactPhone || null,
            },
          },
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitCost: item.unitCost,
            })),
          },
        },
      }),

    markPurchaseOrderReceived: (id: string) =>
      db.$transaction(async (tx) => {
        const purchaseOrder = await tx.purchaseOrder.update({
          where: { id },
          data: { status: "received" },
          include: { items: true },
        });

        await Promise.all(
          purchaseOrder.items.map(
            (item: { productId: string; quantity: number }) =>
              tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    increment: item.quantity,
                  },
                },
              }),
          ),
        );

        return purchaseOrder;
      }),

    deletePurchaseOrder: (id: string) =>
      db.$transaction(async (tx) => {
        await tx.purchaseOrderItem.deleteMany({
          where: { purchaseOrderId: id },
        });
        await tx.purchaseOrder.delete({
          where: { id },
        });
      }),
  };
}
