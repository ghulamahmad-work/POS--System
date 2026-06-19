"use server";

import { createPakistanDb } from "@repo/database/pakistan";
import { createSalesService } from "@repo/database/sales";
import { createSalesActions } from "@repo/pos-core/sales";

const pakistanDb = createPakistanDb();
const salesService = createSalesService(pakistanDb);
const actions = createSalesActions(salesService);

export const checkout = actions.checkout;
