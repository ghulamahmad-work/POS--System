"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

export type ProductFieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  min?: number;
  step?: string | number;
  options?: { value: string; label: string }[];
  monospace?: boolean;
};

type ProductFormProps = {
  fields: ProductFieldConfig[];
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
  defaultValues?: Record<string, string | number | null | undefined>;
  onSuccess?: () => void;
  onError?: () => void;
};

function formatDefaultValue(
  field: ProductFieldConfig,
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined || value === "") return "";
  if (field.type === "date") {
    return new Date(value).toISOString().slice(0, 10);
  }
  return String(value);
}

export function ProductForm({
  fields,
  onSubmit,
  submitLabel,
  defaultValues = {},
  onSuccess,
  onError,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await onSubmit(formData);
      onSuccess?.();
    } catch {
      onError?.();
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => {
        const defaultValue = formatDefaultValue(field, defaultValues[field.name]);

        if (field.type === "select" && field.options) {
          return (
            <Select
              key={field.name}
              name={field.name}
              label={field.label}
              required={field.required}
              optional={field.optional}
              defaultValue={defaultValue}
              options={field.options}
            />
          );
        }

        return (
          <Input
            key={field.name}
            name={field.name}
            type={field.type}
            label={field.label}
            required={field.required}
            optional={field.optional}
            placeholder={field.placeholder}
            min={field.min}
            step={field.step}
            defaultValue={defaultValue}
            monospace={field.monospace}
          />
        );
      })}

      <Button type="submit" loading={loading} className="mt-2 self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
