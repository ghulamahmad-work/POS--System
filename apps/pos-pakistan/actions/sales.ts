"use server";

import { createPakistanSalesService } from "@repo/database-prisma/pakistan";
import { createSalesActions } from "@repo/pos-core/sales";

const actions = createSalesActions(createPakistanSalesService());

export const checkout = actions.checkout;
