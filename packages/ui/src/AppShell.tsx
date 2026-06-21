"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

type AppShellProps = {
  appName: string;
  pageTitle: string;
  headerActions?: ReactNode;
  children: ReactNode;
  userLabel?: string;
};

type IconProps = {
  className?: string;
};

const navItems = [
  { label: "Dashboard", href: "/", icon: DashboardIcon },
  { label: "Products", href: "/products", icon: ProductsIcon },
  { label: "Sales", href: "/sales", icon: SalesIcon },
  { label: "Purchases", href: "/purchases", icon: PurchasesIcon },
  { label: "Reports", href: "/reports", icon: ReportsIcon },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandLogo({ appName }: { appName: string }) {
  const isElectric = appName.toLowerCase().includes("electric");
  if (isElectric) {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-50)] border border-[var(--brand-500)]/20 text-[var(--brand-600)] shadow-sm transition-all duration-200 hover:scale-105">
        <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      </div>
    );
  }
  
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-50)] border border-[var(--brand-500)]/20 text-[var(--brand-600)] shadow-sm transition-all duration-200 hover:scale-105">
      <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1" fill="currentColor"/>
        <circle cx="20" cy="21" r="1" fill="currentColor"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </div>
  );
}

export function AppShell({
  appName,
  pageTitle,
  headerActions,
  children,
  userLabel = "Store Operator",
}: AppShellProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarWidth = expanded ? "md:w-64" : "md:w-20 lg:w-64";
  const contentOffset = expanded ? "md:pl-64" : "md:pl-20 lg:pl-64";

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--text-primary)] antialiased font-sans">
      {/* Mobile Drawer Backdrop */}
      <div
        className={cx(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Sidebar */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border-subtle)] bg-[var(--panel)] shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <BrandLogo appName={appName} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-none text-[var(--text-primary)]">{appName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
            aria-label="Close navigation menu"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                  active
                    ? "bg-[var(--brand-50)] text-[var(--brand-600)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                {active && (
                  <span className="absolute left-1 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[var(--brand-500)]" />
                )}
                <Icon className="size-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border-subtle)] p-3 bg-[var(--panel)]">
          <button
            type="button"
            className="w-full flex h-12 items-center gap-3 rounded-lg px-2 text-left hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-50)] text-xs font-bold text-[var(--brand-700)] ring-1 ring-[var(--brand-500)]/10">
              {userLabel.split(" ").map((w) => w[0]).join("").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-none text-[var(--text-primary)]">{userLabel}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Settings & Profile</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-[var(--border-subtle)] bg-[var(--panel)] transition-[width] duration-300 ease-in-out md:flex md:flex-col overflow-visible",
          sidebarWidth
        )}
      >
        <div className={cx(
          "flex h-16 items-center border-b border-[var(--border-subtle)] px-4 shrink-0 transition-all duration-300",
          expanded ? "justify-start gap-3" : "md:justify-center lg:justify-start lg:gap-3"
        )}>
          <BrandLogo appName={appName} />
          <div className={cx("min-w-0 lg:block transition-all duration-300", expanded ? "block" : "hidden")}>
            <p className="truncate text-sm font-bold leading-none text-[var(--text-primary)]">{appName}</p>
          </div>
        </div>

        <nav aria-label="Primary desktop navigation" className="flex-1 space-y-1.5 p-3 overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "group relative flex h-11 items-center rounded-lg px-3 text-sm font-semibold transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]",
                  expanded 
                    ? "justify-start gap-3" 
                    : "md:justify-center lg:justify-start lg:gap-3",
                  active
                    ? "bg-[var(--brand-50)] text-[var(--brand-600)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                {active && (
                  <span className="absolute left-1 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[var(--brand-500)]" />
                )}
                
                <Icon className="size-5 shrink-0" />
                
                <span className={cx("truncate lg:inline transition-all duration-300", expanded ? "inline" : "hidden")}>
                  {item.label}
                </span>

                {/* Tooltip on tablet collapsed hover */}
                <span className={cx(
                  "pointer-events-none absolute left-full ml-4 scale-95 rounded bg-slate-900 px-2 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-all duration-150 ease-out z-50 whitespace-nowrap invisible",
                  !expanded 
                    ? "md:group-hover:scale-100 md:group-hover:opacity-100 md:group-hover:visible lg:group-hover:invisible"
                    : "group-hover:invisible"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Expand/Collapse Toggle (Tablet only) */}
        <div className="p-3 border-t border-[var(--border-subtle)] md:flex lg:hidden justify-center shrink-0">
          <button
            type="button"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setExpanded((value) => !value)}
            className="flex h-9 w-full items-center justify-center rounded-md border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]"
          >
            <ChevronIcon className={cx("size-4 transition-transform duration-200", expanded && "rotate-180")} />
          </button>
        </div>

        <div className="border-t border-[var(--border-subtle)] p-3 shrink-0 bg-[var(--panel)]">
          <button
            type="button"
            className={cx(
              "w-full flex h-12 items-center rounded-lg text-left hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]",
              expanded ? "px-2 gap-3" : "md:justify-center lg:px-2 lg:justify-start lg:gap-3"
            )}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-50)] text-xs font-bold text-[var(--brand-700)] ring-1 ring-[var(--brand-500)]/10">
              {userLabel.split(" ").map((w) => w[0]).join("").toUpperCase()}
            </div>
            <div className={cx("min-w-0 lg:block", expanded ? "block" : "hidden")}>
              <p className="truncate text-sm font-semibold leading-none text-[var(--text-primary)]">{userLabel}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Settings & Profile</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cx("min-h-screen flex flex-col transition-[padding] duration-300 ease-in-out pb-12 md:pb-0", contentOffset)}>
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--panel)]/90 backdrop-blur-md shrink-0">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Button */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 -ml-2 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)] md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <MenuIcon className="size-6" />
              </button>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-600)] md:hidden">
                  {appName}
                </span>
                <h1 className="text-xl font-bold leading-none text-[var(--text-primary)] sm:text-2xl tracking-tight">
                  {pageTitle}
                </h1>
              </div>
            </div>

            {headerActions ? (
              <div className="flex flex-wrap items-center gap-3">{headerActions}</div>
            ) : null}
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function DashboardIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

function ProductsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function SalesIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" x2="12" y1="1" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PurchasesIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function ReportsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}

function ChevronIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function MenuIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}
