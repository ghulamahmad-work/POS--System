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
        <label htmlFor={inputId} className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
          {label}
          {required && <span className="text-[var(--brand-500)] ml-0.5">*</span>}
          {optional && !required && (
            <span className="text-[var(--text-muted)] font-normal ml-1.5 text-xs">(optional)</span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={[
            "h-10 px-3 rounded-lg w-full text-sm text-[var(--text-primary)]",
            "bg-[var(--canvas)] border border-[var(--border-subtle)]",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/30 focus:border-[var(--brand-500)]",
            "placeholder:text-[var(--text-muted)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            monospace ? "font-mono text-xs tracking-wide" : "",
            className ?? "",
          ].filter(Boolean).join(" ")}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";