import { dubaiDb } from "@repo/database-prisma/dubai";
import { StatCard, SalesChart, TopProductsList, EmptyState } from "@repo/ui/DashboardComponents";
import { formatCurrency } from "@repo/ui/formatCurrency";
import { AppFrame } from "./AppFrame";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ period?: string }>;
};

function BanknotesIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" x2="21" y1="6" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" x2="7.01" y1="7" y2="7" />
    </svg>
  );
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = params.period === "month" ? "month" : "week";
  const days = period === "month" ? 30 : 7;

  // Check if store has any sales at all
  const totalSalesCount = await dubaiDb.sale.count();
  if (totalSalesCount === 0) {
    return (
      <AppFrame pageTitle="Dashboard">
        <EmptyState
          title="No sales recorded yet"
          description="Get started by recording your very first customer sale."
          actionLabel="Record a Sale"
          actionHref="/sales"
        />
      </AppFrame>
    );
  }

  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const prevStartDate = new Date(now.getTime() - 2 * days * 24 * 60 * 60 * 1000);

  // 1. Fetch current sales in scope
  const currentSales = await dubaiDb.sale.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    include: {
      items: true,
    },
  });

  // 2. Fetch previous sales in scope
  const previousSales = await dubaiDb.sale.findMany({
    where: {
      createdAt: {
        gte: prevStartDate,
        lt: startDate,
      },
    },
  });

  // 3. Low stock count
  const lowStockCount = await dubaiDb.product.count({
    where: {
      stock: { lt: 10 },
    },
  });

  // Calculate statistics
  const currentRevenue = currentSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const previousRevenue = previousSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const currentOrders = currentSales.length;
  const previousOrders = previousSales.length;

  const getDelta = (curr: number, prev: number) => {
    if (prev === 0) return undefined;
    const diffPercent = ((curr - prev) / prev) * 100;
    return {
      label: `${diffPercent >= 0 ? "+" : ""}${diffPercent.toFixed(0)}%`,
      isPositive: diffPercent >= 0,
    };
  };

  const revenueDelta = getDelta(currentRevenue, previousRevenue);
  const ordersDelta = getDelta(currentOrders, previousOrders);

  // Top Category sold in current period
  const productIds = Array.from(new Set(currentSales.flatMap((s) => s.items.map((i) => i.productId))));
  const products = await dubaiDb.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const categoryQty: Record<string, number> = {};
  for (const sale of currentSales) {
    for (const item of sale.items) {
      const prod = productMap.get(item.productId);
      if (prod) {
        categoryQty[prod.category] = (categoryQty[prod.category] || 0) + item.quantity;
      }
    }
  }

  let topCategory = "N/A";
  let maxCatQty = 0;
  for (const [cat, qty] of Object.entries(categoryQty)) {
    if (qty > maxCatQty) {
      maxCatQty = qty;
      topCategory = cat;
    }
  }

  // Top Selling Products
  const productQty: Record<string, number> = {};
  for (const sale of currentSales) {
    for (const item of sale.items) {
      productQty[item.productId] = (productQty[item.productId] || 0) + item.quantity;
    }
  }

  const topProductsSorted = Object.entries(productQty)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topProductIds = topProductsSorted.map(([id]) => id);
  const topProductsDetails = await dubaiDb.product.findMany({
    where: { id: { in: topProductIds } },
  });
  const topProductsMap = new Map(topProductsDetails.map((p) => [p.id, p]));

  const topItems = topProductsSorted.map(([id, qty]) => {
    const prod = topProductsMap.get(id);
    return {
      name: prod?.name || "Unknown Product",
      category: prod?.category || "Grocery",
      quantity: qty,
      price: prod?.price || 0,
    };
  });

  // Chart data
  const salesByDay: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    salesByDay[label] = 0;
  }

  for (const sale of currentSales) {
    const label = new Date(sale.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
if (label in salesByDay) {
  salesByDay[label] = (salesByDay[label] ?? 0) + sale.totalAmount;
}
  }

  const chartData = Object.entries(salesByDay).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <AppFrame pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Stat Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Revenue"
            value={formatCurrency(currentRevenue, "AED")}
            icon={<BanknotesIcon />}
            delta={revenueDelta}
            highlighted
          />
          <StatCard
            label="Sales Count"
            value={currentOrders}
            icon={<ShoppingBagIcon />}
            delta={ordersDelta}
          />
          <StatCard
            label="Low Stock Items"
            value={lowStockCount}
            icon={<AlertTriangleIcon />}
          />
          <StatCard
            label="Top Category"
            value={topCategory}
            icon={<TagIcon />}
          />
        </div>

        {/* Charts & Activity Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChart data={chartData} currency="AED" />
          </div>
          <div>
            <TopProductsList items={topItems} currency="AED" />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
