import type { PrismaClient } from "@prisma/client";

export function createSalesService(db: PrismaClient) {
  return {
    createSale: async (data: {
      totalAmount: number;
      taxAmount: number;
      paymentType: string;
      items: {
        productId: string;
        quantity: number;
        unitPrice: number;
      }[];
    }) => {
      // Use a transaction to ensure all operations succeed or fail together
      return db.$transaction(async (tx: any) => {
        // 1. Create the sale and sale items
        const sale = await tx.sale.create({
          data: {
            totalAmount: data.totalAmount,
            taxAmount: data.taxAmount,
            paymentType: data.paymentType,
            items: {
              create: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            },
          },
          include: {
            items: true,
          },
        });

        // 2. Decrement the stock of each product sold
        for (const item of data.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        return sale;
      });
    },
  };
}
