const NBSP = "\u00A0";

/**
 * Formats a monetary amount with ISO currency code and non-breaking space separator.
 * e.g. "AED 1,222.00" or "PKR 1,222"
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const fractionDigits = currencyCode === "PKR" ? 0 : 2;
  const formatted = new Intl.NumberFormat("en", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
  return `${currencyCode}${NBSP}${formatted}`;
}
