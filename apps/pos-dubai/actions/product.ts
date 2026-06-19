"use server";

import { createDubaiDb } from "@repo/database/dubai";
import { createProductService } from "@repo/database/products";
import { createProductActions } from "@repo/pos-core/products";

const dubaiDb = createDubaiDb();
const productService = createProductService(dubaiDb);
const actions = createProductActions(productService);

export const getProducts = actions.getProducts;
export const getProductById = actions.getProductById;
export const createProduct = actions.createProduct;
export const updateProduct = actions.updateProduct;
export const deleteProduct = actions.deleteProduct;
