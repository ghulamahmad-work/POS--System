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
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table className="min-w-[900px]">
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
                  <TableCell colSpan={11} className="py-12 text-center text-sm text-(--text-muted)">
                    {query ? `No products match "${params.q}".` : "No products available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-(--border-subtle)">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: Product) => (
              <div key={product.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-(--text-primary) truncate">{product.name}</p>
                    <p className="text-xs text-(--text-muted) mt-0.5">{product.category}</p>
                  </div>
                  <ProductActions productId={product.id} deleteAction={deleteProduct} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-(--text-muted)">Price:</span>
                    <p className="font-semibold tabular-nums text-(--text-primary)">{formatCurrency(product.price, "PKR")}</p>
                  </div>
                  <div>
                    <span className="text-(--text-muted)">Stock:</span>
                    <p className="font-semibold tabular-nums text-(--text-primary)">{product.stock}</p>
                  </div>
                  <div>
                    <span className="text-(--text-muted)">SKU:</span>
                    <p className="text-(--text-primary)">{product.sku ?? "—"}</p>
                  </div>
                  <div>
                    <span className="text-(--text-muted)">Brand:</span>
                    <p className="text-(--text-primary)">{product.brand ?? "—"}</p>
                  </div>
                </div>
                {(product.modelNumber || product.serialNumber || product.voltage || product.warrantyMonths) && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.modelNumber && (
                      <div>
                        <span className="text-(--text-muted)">Model:</span>
                        <p className="text-(--text-primary)">{product.modelNumber}</p>
                      </div>
                    )}
                    {product.serialNumber && (
                      <div>
                        <span className="text-(--text-muted)">Serial:</span>
                        <p className="text-(--text-primary)">{product.serialNumber}</p>
                      </div>
                    )}
                    {product.voltage && (
                      <div>
                        <span className="text-(--text-muted)">Voltage:</span>
                        <p className="text-(--text-primary)">{product.voltage}</p>
                      </div>
                    )}
                    {product.warrantyMonths && (
                      <div>
                        <span className="text-(--text-muted)">Warranty:</span>
                        <p className="text-(--text-primary)">{product.warrantyMonths} months</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-sm text-(--text-muted)">
              {query ? `No products match "${params.q}".` : "No products available."}
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}