"use server";

import { createDubaiDb } from "@repo/database/dubai";
import { createSalesService } from "@repo/database/sales";
import { createSalesActions } from "@repo/pos-core/sales";

const dubaiDb = createDubaiDb();
const salesService = createSalesService(dubaiDb);
const actions = createSalesActions(salesService);

export const checkout = actions.checkout;
