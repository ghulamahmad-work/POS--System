import { pakistanDb } from "@repo/database-prisma/pakistan";
import { ReportsDashboard } from "@repo/ui/ReportsDashboard";
import { AppFrame } from "../AppFrame";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sales = await pakistanDb.sale.findMany({
    where: {
      createdAt: { gte: startOfMonth },
    },
    select: {
      totalAmount: true,
    },
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const purchases = await pakistanDb.purchaseOrder.findMany({
    where: {
      createdAt: { gte: startOfMonth },
      status: "received",
    },
    select: {
      totalAmount: true,
    },
  });

  const totalPurchaseSpend = purchases.reduce(
    (sum, purchase) => sum + purchase.totalAmount,
    0,
  );

  const lowStockProducts = await pakistanDb.product.findMany({
    where: {
      stock: { lt: 10 },
    },
    orderBy: {
      stock: "asc",
    },
  });

  const recentSales = await pakistanDb.sale.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <AppFrame
      pageTitle="Reports"
      headerActions={
        <button
          type="button"
          className="rounded-md border border-[var(--border-subtle)] bg-[var(--panel)] px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
        >
          Since {startOfMonth.toLocaleDateString()}
        </button>
      }
    >
      <ReportsDashboard
        totalRevenue={totalRevenue}
        totalPurchaseSpend={totalPurchaseSpend}
        netFigure={totalRevenue - totalPurchaseSpend}
        startOfMonth={startOfMonth.toLocaleDateString()}
        lowStockProducts={lowStockProducts}
        recentSales={recentSales}
        currency="PKR"
      />
    </AppFrame>
  );
}
