type SaleInput = {
  totalAmount: number;
  taxAmount: number;
  paymentType: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
};

type SaleTransactionDb = {
  sale: {
    create: (args: any) => Promise<any>;
  };
  product: {
    update: (args: any) => Promise<any>;
  };
};

type SalesDb = SaleTransactionDb & {
  $transaction: <T>(callback: (tx: SaleTransactionDb) => Promise<T>) => Promise<T>;
};

export function createSalesService(db: SalesDb) {
  return {
    createSale: (data: SaleInput) =>
      db.$transaction(async (tx) => {
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
        });

        await Promise.all(
          data.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            }),
          ),
        );

        return sale;
      }),
  };
}
