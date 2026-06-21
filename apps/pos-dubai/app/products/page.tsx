import Link from "next/link";
import { getProducts, deleteProduct } from "../../actions/product";
import { AppFrame } from "../AppFrame";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/Table";
import { Badge } from "@repo/ui/Badge";
import { ProductActions } from "@repo/ui/ProductActions";
import { formatCurrency } from "@repo/ui/formatCurrency";

export const dynamic = "force-dynamic";

function productHeaderActions() {
  return (
    <>
      <label className="sr-only" htmlFor="product-search">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        placeholder="Search products"
        className="h-10 w-full min-w-0 rounded-md border border-[var(--border-subtle)] bg-[var(--panel)] px-3 text-sm shadow-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)] sm:w-64"
      />
      <Link
        href="/products/new"
        className="inline-flex h-10 items-center rounded-md bg-[var(--brand-600)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
      >
        Add Product
      </Link>
    </>
  );
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <AppFrame pageTitle="Products" headerActions={productHeaderActions()}>
      <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--panel)] shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit Size</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: (typeof products)[number]) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-[var(--text-primary)]">{product.name}</TableCell>
                  <TableCell className="tabular-nums">{formatCurrency(product.price, "AED")}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? (product.stock < 10 ? "warning" : "success") : "danger"}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.unitOfMeasure && product.unitQuantity
                      ? `${product.unitQuantity} ${product.unitOfMeasure}`
                      : product.weightGrams
                        ? `${product.weightGrams} g`
                        : "—"}
                  </TableCell>
                  <TableCell className="text-[var(--text-muted)]">
                    {product.expiryDate
                      ? new Date(product.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <ProductActions productId={product.id} deleteAction={deleteProduct} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppFrame>
  );
}
