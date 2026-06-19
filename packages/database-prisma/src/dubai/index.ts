import { createProductService } from "../services/productService";
import { createPurchasesService } from "../services/purchasesService";
import { createSalesService } from "../services/salesService";
import { dubaiDb } from "./client";

export { dubaiDb } from "./client";

export function createDubaiProductService(db = dubaiDb) {
  return createProductService(db);
}

export function createDubaiPurchasesService(db = dubaiDb) {
  return createPurchasesService(db);
}

export function createDubaiSalesService(db = dubaiDb) {
  return createSalesService(db);
}
