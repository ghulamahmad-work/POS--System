import { createProductService } from "../services/productService";
import { createPurchasesService } from "../services/purchasesService";
import { createSalesService } from "../services/salesService";
import { pakistanDb } from "./client";

export { pakistanDb } from "./client";

export function createPakistanProductService(db = pakistanDb) {
  return createProductService(db);
}

export function createPakistanPurchasesService(db = pakistanDb) {
  return createPurchasesService(db);
}

export function createPakistanSalesService(db = pakistanDb) {
  return createSalesService(db);
}
