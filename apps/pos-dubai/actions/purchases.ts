"use server";

import { createDubaiPurchasesService } from "@repo/database-prisma/dubai";
import { createPurchasesActions } from "@repo/pos-core/purchases";

const actions = createPurchasesActions(createDubaiPurchasesService());

export const getPurchaseOrders = actions.getPurchaseOrders;
export const createPurchaseOrder = actions.createPurchaseOrder;
export const markAsReceived = actions.markAsReceived;
export const deletePurchaseOrder = actions.deletePurchaseOrder;
