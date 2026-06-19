"use server";

import { createPakistanDb } from "@repo/database/pakistan";
import { createProductService } from "@repo/database/products";
import { createProductActions } from "@repo/pos-core/products";

const pakistanDb = createPakistanDb();
const productService = createProductService(pakistanDb);
const actions = createProductActions(productService);

export const getProducts = actions.getProducts;
export const getProductById = actions.getProductById;
export const createProduct = actions.createProduct;
export const updateProduct = actions.updateProduct;
export const deleteProduct = actions.deleteProduct;
