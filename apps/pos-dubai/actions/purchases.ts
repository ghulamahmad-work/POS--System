"use server";

import { dubaiDb } from "@repo/database/dubai";
import { createPurchasesService } from "@repo/database/purchases";
import { createPurchasesActions } from "@repo/pos-core/purchases";

const service = createPurchasesService(dubaiDb);
const actions = createPurchasesActions(service);

export const getPurchaseOrders = actions.getPurchaseOrders;
export const createPurchaseOrder = actions.createPurchaseOrder;
export const markAsReceived = actions.markAsReceived;
export const deletePurchaseOrder = actions.deletePurchaseOrder;
