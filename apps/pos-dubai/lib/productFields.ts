import type { ProductFieldConfig } from "@repo/ui/ProductForm";

export const DUBAI_UNIT_OF_MEASURE_OPTIONS = [
  { value: "", label: "— Select unit —" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "litre", label: "Litre" },
  { value: "ml", label: "Millilitre (ml)" },
  { value: "piece", label: "Piece" },
  { value: "pack", label: "Pack" },
];

export const dubaiProductFields: ProductFieldConfig[] = [
  {
    name: "name",
    label: "Product Name",
    type: "text",
    required: true,
    placeholder: "e.g. Organic Bananas",
  },
  {
    name: "sku",
    label: "Barcode / SKU",
    type: "text",
    optional: true,
    placeholder: "e.g. 8901234567890",
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
    placeholder: "e.g. Produce, Dairy",
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
    name: "expiryDate",
    label: "Expiry Date",
    type: "date",
    optional: true,
  },
  {
    name: "unitOfMeasure",
    label: "Unit of Measure",
    type: "select",
    optional: true,
    options: DUBAI_UNIT_OF_MEASURE_OPTIONS,
  },
  {
    name: "unitQuantity",
    label: "Unit Quantity",
    type: "number",
    optional: true,
    min: 0,
    step: "0.01",
    placeholder: "e.g. 500 for 500g",
  },
  // TODO: lowStockThreshold — low-stock badge currently uses hardcoded threshold of 10
  // TODO: supplier select — no product.supplierId column; Vendor entity exists for purchases only
];
