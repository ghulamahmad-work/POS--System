"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { StatCard } from "./DashboardComponents";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import { formatCurrency } from "./formatCurrency";

type Product = { id: string; name: string; stock: number; category: string };
type Sale = {
  id: string;
  totalAmount: number;
  paymentType: string;
  createdAt: Date | string;
};

type Props = {
  totalRevenue: number;
  totalPurchaseSpend: number;
  netFigure: number;
  startOfMonth: string;
  lowStockProducts: Product[];
  recentSales: Sale[];
  currency: string;
};

export function ReportsDashboard({
  totalRevenue,
  totalPurchaseSpend,
  netFigure,
  lowStockProducts,
  recentSales,
  currency,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("range") || "month";

  const createRangeLink = (range: "week" | "month" | "year") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-(--text-primary)">Business Insights</h2>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-(--canvas) p-1 rounded-lg border border-(--border-subtle)">
          <Link
            href={createRangeLink("week")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              currentPeriod === "week"
                ? "bg-(--panel) text-(--brand-600) shadow-sm border border-(--border-subtle)"
                : "text-(--text-muted) hover:text-(--text-primary)"
            }`}
          >
            This Week
          </Link>
          <Link
            href={createRangeLink("month")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              currentPeriod === "month"
                ? "bg-(--panel) text-(--brand-600) shadow-sm border border-(--border-subtle)"
                : "text-(--text-muted) hover:text-(--text-primary)"
            }`}
          >
            This Month
          </Link>
          <Link
            href={createRangeLink("year")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              currentPeriod === "year"
                ? "bg-(--panel) text-(--brand-600) shadow-sm border border-(--border-subtle)"
                : "text-(--text-muted) hover:text-(--text-primary)"
            }`}
          >
            This Year
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue, currency)}
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          highlighted
        />
        <StatCard
          label="Total Spend"
          value={formatCurrency(totalPurchaseSpend, currency)}
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          label="Net Cashflow"
          value={formatCurrency(netFigure, currency)}
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <div className="self-start overflow-hidden rounded-xl border border-(--border-subtle) bg-(--panel) shadow-sm">
          <div className="border-b border-(--border-subtle) p-5">
            <h3 className="text-base font-bold text-(--text-primary)">Low Stock Alerts</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-(--text-muted) py-8">
                    All stock levels are healthy.
                  </TableCell>
                </TableRow>
              ) : (
                lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-(--text-primary)">{product.name}</TableCell>
                    <TableCell className="text-(--text-muted)">{product.category}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center rounded-full border border-rose-200 bg-transparent px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                        {product.stock}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="self-start overflow-hidden rounded-xl border border-(--border-subtle) bg-(--panel) shadow-sm">
          <div className="border-b border-(--border-subtle) p-5">
            <h3 className="text-base font-bold text-(--text-primary)">Recent Sales Activity</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-(--text-muted) py-8">
                    No sales recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="text-(--text-muted)">
                      {new Date(sale.createdAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-(--text-primary) font-medium">
                        {sale.paymentType}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-bold text-(--text-primary)">
                      {formatCurrency(sale.totalAmount, currency)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
