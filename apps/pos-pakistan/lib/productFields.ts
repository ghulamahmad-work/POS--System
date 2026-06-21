import type { ProductFieldConfig } from "@repo/ui/ProductForm";

export const pakistanProductFields: ProductFieldConfig[] = [
  {
    name: "name",
    label: "Product Name",
    type: "text",
    required: true,
    placeholder: "e.g. Ceiling Fan 56 inch",
  },
  {
    name: "sku",
    label: "Barcode / SKU",
    type: "text",
    optional: true,
    placeholder: "e.g. CF-56-220V",
    monospace: true,
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    required: true,
    min: 0,
    step: "0.01",
    placeholder: "0.00",
  },
  {
    name: "category",
    label: "Category",
    type: "text",
    required: true,
    placeholder: "e.g. Fans, Lighting",
  },
  {
    name: "stock",
    label: "Stock Quantity",
    type: "number",
    required: true,
    min: 0,
    step: 1,
    placeholder: "0",
  },
  {
    name: "brand",
    label: "Brand / Manufacturer",
    type: "text",
    optional: true,
    placeholder: "e.g. Philips, Orient",
  },
  {
    name: "modelNumber",
    label: "Model Number",
    type: "text",
    optional: true,
    placeholder: "e.g. CF-2200",
  },
  {
    name: "serialNumber",
    label: "Serial Number",
    type: "text",
    optional: true,
    placeholder: "e.g. SN-2024-001",
    monospace: true,
  },
  {
    name: "voltage",
    label: "Voltage",
    type: "text",
    optional: true,
    placeholder: "e.g. 220V",
  },
  {
    name: "warrantyMonths",
    label: "Warranty Period (months)",
    type: "number",
    optional: true,
    min: 0,
    step: 1,
    placeholder: "e.g. 12",
  },
  // TODO: lowStockThreshold — low-stock badge currently uses hardcoded threshold of 10
  // TODO: supplier select — no product.supplierId column; Vendor entity exists for purchases only
];
