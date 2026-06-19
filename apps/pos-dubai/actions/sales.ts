"use server";

import { createDubaiSalesService } from "@repo/database-prisma/dubai";
import { createSalesActions } from "@repo/pos-core/sales";

const actions = createSalesActions(createDubaiSalesService());

export const checkout = actions.checkout;
