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
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--text-primary)]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
          {optional && !required && (
            <span className="text-[var(--text-muted)] font-normal ml-1">(optional)</span>
          )}
        </label>
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={[
            "border border-[var(--border-subtle)] bg-[var(--panel)] p-2 rounded-md w-full text-[var(--text-primary)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)]",
            className ?? "",
          ].join(" ")}
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
