import { dubaiDb } from "@repo/database-prisma/dubai";
import { ReportsDashboard } from "@repo/ui/ReportsDashboard";
import { AppFrame } from "../AppFrame";

export const revalidate = 60;

export default async function ReportsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [sales, purchases, lowStockProducts, recentSales] = await Promise.all([
    dubaiDb.sale.findMany({
      where: {
        createdAt: { gte: startOfMonth },
      },
      select: {
        totalAmount: true,
      },
    }),
    dubaiDb.purchaseOrder.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: "received",
      },
      select: {
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

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPurchaseSpend = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  return (
    <AppFrame
      pageTitle="Reports"
    >
      <ReportsDashboard
        totalRevenue={totalRevenue}
        totalPurchaseSpend={totalPurchaseSpend}
        netFigure={totalRevenue - totalPurchaseSpend}
        startOfMonth={startOfMonth.toLocaleDateString()}
        lowStockProducts={lowStockProducts}
        recentSales={recentSales}
        currency="AED"
      />
    </AppFrame>
  );
}
