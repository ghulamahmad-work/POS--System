"use server";

import { createPakistanProductService } from "@repo/database-prisma/pakistan";
import { createProductActions } from "@repo/pos-core/products";

const actions = createProductActions(createPakistanProductService());

export const getProducts = actions.getProducts;
export const getProductById = actions.getProductById;
export const createProduct = actions.createProduct;
export const updateProduct = actions.updateProduct;
export const deleteProduct = actions.deleteProduct;
