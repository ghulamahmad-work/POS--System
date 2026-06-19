"use server";

import { createDubaiProductService } from "@repo/database-prisma/dubai";
import { createProductActions } from "@repo/pos-core/products";

const actions = createProductActions(createDubaiProductService());

export const getProducts = actions.getProducts;
export const getProductById = actions.getProductById;
export const createProduct = actions.createProduct;
export const updateProduct = actions.updateProduct;
export const deleteProduct = actions.deleteProduct;
