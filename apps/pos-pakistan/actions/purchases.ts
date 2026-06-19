"use server";

import { pakistanDb } from "@repo/database/pakistan";
import { createPurchasesService } from "@repo/database/purchases";
import { createPurchasesActions } from "@repo/pos-core/purchases";

const service = createPurchasesService(pakistanDb);
const actions = createPurchasesActions(service);

export const getPurchaseOrders = actions.getPurchaseOrders;
export const createPurchaseOrder = actions.createPurchaseOrder;
export const markAsReceived = actions.markAsReceived;
export const deletePurchaseOrder = actions.deletePurchaseOrder;
