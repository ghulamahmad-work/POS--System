import { dubaiDb } from "@repo/database/dubai";
import { ReportsDashboard } from "@repo/ui/ReportsDashboard";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sales = await dubaiDb.sale.findMany({
    where: { createdAt: { gte: startOfMonth } },
    select: { totalAmount: true },
  });
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  const purchases = await dubaiDb.purchaseOrder.findMany({
    where: { createdAt: { gte: startOfMonth }, status: "received" },
    select: { totalAmount: true },
  });
  const totalPurchaseSpend = purchases.reduce((sum, p) => sum + p.totalAmount, 0);

  const lowStockProducts = await dubaiDb.product.findMany({
    where: { stock: { lt: 10 } },
    orderBy: { stock: "asc" },
  });

  const recentSales = await dubaiDb.sale.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <ReportsDashboard
      totalRevenue={totalRevenue}
      totalPurchaseSpend={totalPurchaseSpend}
      netFigure={totalRevenue - totalPurchaseSpend}
      startOfMonth={startOfMonth.toLocaleDateString()}
      lowStockProducts={lowStockProducts}
      recentSales={recentSales}
      currency="AED"
    />
  );
}
