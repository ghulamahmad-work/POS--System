import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  optional?: boolean;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, optional, options, className, id, required, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
          {label}
          {required && <span className="text-[var(--brand-500)] ml-0.5">*</span>}
          {optional && !required && (
            <span className="text-[var(--text-muted)] font-normal ml-1.5 text-xs">(optional)</span>
          )}
        </label>
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={[
            "h-10 px-3 rounded-lg w-full text-sm text-[var(--text-primary)]",
            "bg-[var(--canvas)] border border-[var(--border-subtle)]",
            "transition-all duration-150 appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/30 focus:border-[var(--brand-500)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className ?? "",
          ].filter(Boolean).join(" ")}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A93A0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            paddingRight: "36px",
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";