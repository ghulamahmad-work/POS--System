"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { formatCurrency } from "./formatCurrency";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type StatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  delta?: {
    label: string; // e.g. "+8% vs last week"
    isPositive: boolean;
  };
  highlighted?: boolean;
};

export function StatCard({ label, value, icon, delta, highlighted = false }: StatCardProps) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md",
        highlighted
          ? "border-[var(--brand-500)]/30 bg-[var(--brand-50)] text-[var(--text-primary)]"
          : "border-[var(--border-subtle)] bg-[var(--panel)] text-[var(--text-primary)]"
      )}
    >
      {highlighted && (
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[var(--brand-500)]/10 blur-xl pointer-events-none" />
      )}

      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/70 text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/15">
          {icon}
        </div>
        <p className={cx("text-sm font-semibold uppercase tracking-wider", highlighted ? "text-[var(--brand-600)]" : "text-[var(--text-muted)]")}>
          {label}
        </p>
        <p className="text-lg font-bold tracking-tight tabular-nums">
          {value}
        </p>
      </div>

      {delta && (
        <div className="mt-4 flex items-center gap-1.5">
          <span
            className={cx(
              "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-bold leading-none",
              delta.isPositive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            )}
          >
            {delta.isPositive ? "↑" : "↓"} {delta.label}
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            vs previous period
          </span>
        </div>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70",
        className
      )}
    />
  );
}

export type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--border-subtle)] bg-[var(--panel)] rounded-xl min-h-[300px]">
      <div className="flex size-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-600)] mb-4 ring-8 ring-[var(--brand-50)]/50">
        <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
          <path d="M12 12V8" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)] max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-[var(--brand-600)] px-4 text-xs font-semibold text-white shadow transition hover:bg-[var(--brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export type SalesChartProps = {
  data: { label: string; value: number }[];
  currency: string;
};

export function SalesChart({ data, currency }: SalesChartProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") === "month" ? "month" : "week";

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const totalPeriodSales = data.reduce((sum, item) => sum + item.value, 0);

  const createPeriodLink = (period: "week" | "month") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    return `${pathname}?${params.toString()}`;
  };

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--panel)] p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Sales Performance</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Total sales in this period: <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(totalPeriodSales, currency)}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[var(--canvas)] p-1 rounded-lg border border-[var(--border-subtle)]">
          <Link
            href={createPeriodLink("week")}
            className={cx(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
              currentPeriod === "week"
                ? "bg-[var(--panel)] text-[var(--brand-600)] shadow-sm border border-[var(--border-subtle)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Last 7 Days
          </Link>
          <Link
            href={createPeriodLink("month")}
            className={cx(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
              currentPeriod === "month"
                ? "bg-[var(--panel)] text-[var(--brand-600)] shadow-sm border border-[var(--border-subtle)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Last 30 Days
          </Link>
        </div>
      </div>

      {!hasData ? (
        <div className="h-64 flex items-center justify-center border border-dashed border-[var(--border-subtle)] bg-[var(--canvas)]/50 rounded-lg">
          <p className="text-sm text-[var(--text-muted)]">No sales data for this period.</p>
        </div>
      ) : (
        <div>
          {/* Chart visual container */}
          <div className="grid grid-flow-col auto-cols-fr gap-1 sm:gap-2.5 h-64 items-end border-b border-[var(--border-subtle)] pb-2 px-1">
            {data.map((item) => {
              const heightPercent = (item.value / maxVal) * 100;
              return (
                <div key={item.label} className="group relative flex flex-col justify-end h-full w-full">
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                    {formatCurrency(item.value, currency)}
                    <div className="text-[8px] text-slate-400 font-medium text-center mt-0.5">{item.label}</div>
                  </div>

                  {/* Vertical bar */}
                  <div
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                    className={cx(
                      "w-full rounded-t bg-[var(--brand-500)]/20 border-t-2 border-[var(--brand-500)] group-hover:bg-[var(--brand-500)]/40 transition-all duration-200 cursor-pointer",
                      item.value > 0 ? "opacity-100" : "opacity-30 border-t-0 bg-slate-100"
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Labels container */}
          <div className="grid grid-flow-col auto-cols-fr gap-1 sm:gap-2.5 px-1 mt-2">
            {data.map((item, index) => (
              <span
                key={item.label}
                className={cx(
                  "text-[9px] text-[var(--text-muted)] text-center block truncate font-medium",
                  currentPeriod === "month" && index % 5 !== 0 && "hidden sm:block"
                )}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type TopProductsListProps = {
  items: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
  }[];
  currency: string;
};

export function TopProductsList({ items, currency }: TopProductsListProps) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--panel)] p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Top Selling Items</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Most popular items by units sold</p>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-[var(--brand-600)] hover:text-[var(--brand-700)] hover:underline"
        >
          View Catalog
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-[var(--border-subtle)] bg-[var(--canvas)]/50 rounded-lg p-8 text-center min-h-[200px]">
          <p className="text-sm text-[var(--text-muted)]">No product sales recorded yet.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-4">
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-50)] text-xs font-bold text-[var(--brand-600)] border border-[var(--brand-500)]/10">
                  #{index + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{item.name}</p>
                  <p className="truncate text-xs text-[var(--text-muted)] mt-0.5">{item.category}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {item.quantity} sold
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {formatCurrency(item.price * item.quantity, currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
