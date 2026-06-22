import { Suspense } from "react";
import { pakistanDb } from "@repo/database-prisma/pakistan";
import { ReportsDashboard } from "@repo/ui/ReportsDashboard";
import { AppFrame } from "../AppFrame";

export const revalidate = 60;

export default async function ReportsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [sales, purchases, lowStockProducts, recentSales] = await Promise.all([
    pakistanDb.sale.findMany({
      where: {
        createdAt: { gte: startOfMonth },
      },
      select: {
        totalAmount: true,
      },
    }),
    pakistanDb.purchaseOrder.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: "received",
      },
      select: {
        totalAmount: true,
      },
    }),
    pakistanDb.product.findMany({
      where: {
        stock: { lt: 10 },
      },
      orderBy: {
        stock: "asc",
      },
      select: {
        id: true,
        name: true,
        stock: true,
        category: true,
      },
    }),
    pakistanDb.sale.findMany({
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

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPurchaseSpend = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

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
          startOfMonth={startOfMonth.toLocaleDateString()}
          lowStockProducts={lowStockProducts}
          recentSales={serializedRecentSales}
          currency="PKR"
        />
      </Suspense>
    </AppFrame>
  );
}
