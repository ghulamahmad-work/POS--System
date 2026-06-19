import type { PrismaClient } from "@prisma/client";

export function createProductService(db: PrismaClient) {
  return {

    getProducts: () => {
      return db.product.findMany({
        orderBy: { createdAt: "desc" },
      });
    },

    getProductById: (id: string) => {
      return db.product.findUnique({
        where: { id },
      });
    },


    createProduct: (data: {
      name: string;
      price: number;
      stock: number;
      category: string;
      voltage?: string;
      warrantyMonths?: number | null;
      expiryDate?: Date | null;
      weightGrams?: number | null;
    }) => {
      return db.product.create({
        data,
      });
    },

    updateProduct: (
      id: string,
      data: {
        name: string;
        price: number;
        stock: number;
        category: string;
        voltage?: string;
        warrantyMonths?: number | null;
        expiryDate?: Date | null;
        weightGrams?: number | null;
      }
    ) => {
      return db.product.update({
        where: { id },
        data,
      });
    },


    deleteProduct: (id: string) => {
      return db.product.delete({
        where: { id },
      });
    },
  };
}