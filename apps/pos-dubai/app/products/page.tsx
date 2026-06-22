import Link from "next/link";
import { getProducts, deleteProduct } from "../../actions/product";
import { AppFrame } from "../AppFrame";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/Table";
import { ProductActions } from "@repo/ui/ProductActions";
import { formatCurrency } from "@repo/ui/formatCurrency";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

type Product = Awaited<ReturnType<typeof getProducts>>[number];

function normalizeQuery(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function productMatchesQuery(product: Product, query: string) {
  if (!query) {
    return true;
  }

  const searchableValues = [
    product.name,
    product.category,
    product.sku,
    product.brand,
    product.modelNumber,
    product.serialNumber,
    product.voltage,
    product.unitOfMeasure,
    product.unitQuantity?.toString(),
    product.weightGrams?.toString(),
    product.warrantyMonths?.toString(),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableValues.includes(query);
}

function productHeaderActions(query: string) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="sr-only" htmlFor="product-search">
        Search products
      </label>
      <form className="flex items-center gap-3" method="get">
        <input
          id="product-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search products"
          className="h-10 w-full min-w-0 rounded-md border border-(--border-subtle) bg-(--panel) px-3 text-sm shadow-sm outline-none transition placeholder:text-(--text-muted) focus:border-(--brand-500) focus:ring-2 focus:ring-(--brand-500) sm:w-64"
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-md border border-(--border-subtle) bg-(--panel) px-4 text-sm font-semibold text-(--text-primary) shadow-sm transition hover:bg-(--surface-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)"
        >
          Search
        </button>
        {query ? (
          <Link
            href="/products"
            className="inline-flex h-10 items-center rounded-md border border-(--border-subtle) px-4 text-sm font-semibold text-(--text-primary) shadow-sm transition hover:bg-(--surface-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)"
          >
            Clear
          </Link>
        ) : null}
      </form>
      <Link
        href="/products/new"
        className="inline-flex h-10 items-center rounded-md bg-(--brand-600) px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-700) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)"
      >
        Add Product
      </Link>
    </div>
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = normalizeQuery(params.q);
  const products = (await getProducts()) as Product[];
  const filteredProducts = products.filter((product: Product) => productMatchesQuery(product, query));

  return (
    <AppFrame pageTitle="Products" headerActions={productHeaderActions(params.q ?? "")}>
      <div className="overflow-hidden rounded-lg border border-(--border-subtle) bg-(--panel) shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-190">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Unit Size</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-(--text-primary)">{product.name}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(product.price, "AED")}</TableCell>
                    <TableCell className="text-center tabular-nums text-(--text-primary)">{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.sku ?? "—"}</TableCell>
                    <TableCell>
                      {product.unitOfMeasure && product.unitQuantity
                        ? `${product.unitQuantity} ${product.unitOfMeasure}`
                        : product.weightGrams
                          ? `${product.weightGrams} g`
                          : "—"}
                    </TableCell>
                    <TableCell className="text-(--text-muted)">
                      {product.expiryDate
                        ? new Date(product.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <ProductActions productId={product.id} deleteAction={deleteProduct} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-(--text-muted)">
                    {query ? `No products match "${params.q}".` : "No products available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppFrame>
  );
}
