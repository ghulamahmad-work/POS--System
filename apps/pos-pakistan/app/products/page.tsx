import Link from "next/link";
import { getProducts, deleteProduct } from "../../actions/product";
import { AppFrame } from "../AppFrame";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/Table";
import { ProductActions } from "@repo/ui/ProductActions";
import { formatCurrency } from "@repo/ui/formatCurrency";
import { ProductSearchBar } from "@repo/ui/ProductSearchBar";

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
    product.warrantyMonths?.toString(),
    product.stock?.toString(),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableValues.includes(query);
}

const headerActions = (
  <div className="flex flex-wrap items-center gap-3">
    <ProductSearchBar />
    <Link
      href="/products/new"
      className="inline-flex h-10 items-center rounded-md bg-(--brand-600)/80 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-700)/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)"
    >
      Add Product
    </Link>
  </div>
);

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = normalizeQuery(params.q);
  const products = (await getProducts()) as Product[];
  const filteredProducts = products.filter((product: Product) => productMatchesQuery(product, query));

  return (
    <AppFrame pageTitle="Products" headerActions={headerActions}>
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
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Voltage</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-(--text-primary)">{product.name}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(product.price, "PKR")}</TableCell>
                    <TableCell className="text-center tabular-nums text-(--text-primary)">{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.sku ?? "—"}</TableCell>
                    <TableCell>{product.brand ?? "—"}</TableCell>
                    <TableCell>{product.modelNumber ?? "—"}</TableCell>
                    <TableCell>{product.serialNumber ?? "—"}</TableCell>
                    <TableCell>{product.voltage}</TableCell>
                    <TableCell>{product.warrantyMonths}</TableCell>
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