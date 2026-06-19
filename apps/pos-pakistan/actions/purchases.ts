"use server";

import { createPakistanPurchasesService } from "@repo/database-prisma/pakistan";
import { createPurchasesActions } from "@repo/pos-core/purchases";

const actions = createPurchasesActions(createPakistanPurchasesService());

export const getPurchaseOrders = actions.getPurchaseOrders;
export const createPurchaseOrder = actions.createPurchaseOrder;
export const markAsReceived = actions.markAsReceived;
export const deletePurchaseOrder = actions.deletePurchaseOrder;
