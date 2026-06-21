import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
  monospace?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, optional, monospace, className, id, required, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-primary)]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
          {optional && !required && (
            <span className="text-[var(--text-muted)] font-normal ml-1">(optional)</span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={[
            "border border-[var(--border-subtle)] bg-[var(--panel)] p-2 rounded-md w-full text-[var(--text-primary)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)]",
            "placeholder:text-[var(--text-muted)]",
            monospace ? "font-mono text-sm" : "",
            className ?? "",
          ].join(" ")}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
