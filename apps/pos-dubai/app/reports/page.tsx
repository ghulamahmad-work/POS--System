import { Suspense } from "react";
import { dubaiDb } from "@repo/database-prisma/dubai";
import { ReportsDashboard } from "@repo/ui/ReportsDashboard";
import { AppFrame } from "../AppFrame";

export const revalidate = 60;

export default async function ReportsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [salesSummary, purchasesSummary, lowStockProducts, recentSales] = await Promise.all([
    dubaiDb.sale.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    dubaiDb.purchaseOrder.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: "received",
      },
      _sum: {
        totalAmount: true,
      },
    }),
    dubaiDb.product.findMany({
      where: {
        stock: { lt: 10 },
      },
      orderBy: {
        stock: "asc",
      },
      take: 10,
      select: {
        id: true,
        name: true,
        stock: true,
        category: true,
      },
    }),
    dubaiDb.sale.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        totalAmount: true,
        paymentType: true,
        createdAt: true,
      },
    }),
  ]);

  const totalRevenue = salesSummary._sum.totalAmount ?? 0;
  const totalPurchaseSpend = purchasesSummary._sum.totalAmount ?? 0;

  // Convert Date objects to ISO strings for serialization
  const serializedRecentSales = recentSales.map(sale => ({
    ...sale,
    createdAt: sale.createdAt instanceof Date ? sale.createdAt.toISOString() : sale.createdAt,
  }));

  return (
    <AppFrame
      pageTitle="Reports"
    >
      <Suspense fallback={<div>Loading reports...</div>}>
        <ReportsDashboard
          totalRevenue={totalRevenue}
          totalPurchaseSpend={totalPurchaseSpend}
          netFigure={totalRevenue - totalPurchaseSpend}
          startOfMonth={startOfMonth.toLocaleDateString("en-US")}
          lowStockProducts={lowStockProducts}
          recentSales={serializedRecentSales}
          currency="AED"
        />
      </Suspense>
    </AppFrame>
  );
}
