import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "brand";
}

const badgeVariants = {
  default: "bg-slate-100 text-slate-800 border-transparent",
  brand: "bg-[var(--brand-100)] text-[var(--brand-800)] border-transparent",
  success: "bg-emerald-100 text-emerald-800 border-transparent",
  warning: "bg-amber-100 text-amber-800 border-transparent",
  danger: "bg-rose-100 text-rose-800 border-transparent",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:ring-offset-2 ${badgeVariants[variant]} ${className || ""}`}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
