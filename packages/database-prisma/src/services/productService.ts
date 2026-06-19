type ProductDb = {
  product: {
    findMany: (args?: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };
};

export function createProductService(db: ProductDb) {
  return {
    getProducts: () =>
      db.product.findMany({
        orderBy: { createdAt: "desc" },
      }),

    getProductById: (id: string) =>
      db.product.findUnique({
        where: { id },
      }),

    createProduct: (data: Record<string, unknown>) =>
      db.product.create({
        data,
      }),

    updateProduct: (id: string, data: Record<string, unknown>) =>
      db.product.update({
        where: { id },
        data,
      }),

    deleteProduct: (id: string) =>
      db.product.delete({
        where: { id },
      }),
  };
}
