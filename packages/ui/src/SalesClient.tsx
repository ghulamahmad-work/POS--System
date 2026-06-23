"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";
import { Button } from "./Button";
import { formatCurrency } from "./formatCurrency";

type Product = { id: string; name: string; price: number; stock: number; category: string };
type CartItem = Product & { quantity: number };

type CheckoutData = {
  totalAmount: number;
  taxAmount: number;
  paymentType: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
};

type Props = {
  initialProducts: Product[];
  taxRate: number;
  taxLabel: string;
  currency: string;
  checkoutAction: (data: CheckoutData) => Promise<void>;
};

export function SalesClient({ initialProducts, taxRate, taxLabel, currency, checkoutAction }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    if (!normalizedSearch) {
      return true;
    }

    const searchableValues = [product.name, product.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableValues.includes(normalizedSearch);
  });

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          return newQ > 0 ? { ...item, quantity: newQ } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const handleCheckout = async (paymentType: string) => {
    if (cart.length === 0) return;
    setIsCheckingOut(paymentType);
    try {
      await checkoutAction({
        totalAmount,
        taxAmount,
        paymentType,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      });
      toast(`Sale completed via ${paymentType}!`, "success");
      const snapshot = cart;
      setCart([]);
      setProducts(prev =>
        prev.map(p => {
          const cartItem = snapshot.find(c => c.id === p.id);
          return cartItem ? { ...p, stock: p.stock - cartItem.quantity } : p;
        })
      );
      router.refresh();
    } catch {
      toast("Checkout failed.", "danger");
    } finally {
      setIsCheckingOut(null);
    }
  };

  return (
<div className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-xl border border-(--border-subtle) bg-(--canvas) shadow-sm lg:flex-row">
      {/* ── Left: Product Grid ── */}
<div className="flex min-h-0 flex-1 flex-col p-4 lg:p-5 lg:border-r lg:border-(--border-subtle)">        {/* Search */}
        <div className="relative mb-4 lg:mb-5">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-(--border-subtle) bg-(--panel) pl-9 pr-4 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--brand-500) focus:outline-none focus:ring-2 focus:ring-(--brand-500)/30 transition-all"
          />
        </div>

        {/* Grid */}
<div className="grid min-h-0 auto-rows-max items-start grid-cols-1 gap-3 overflow-y-auto pb-2 sm:grid-cols-2 lg:flex-1">          {filteredProducts.map(p => {
            const outOfStock = p.stock === 0;
            const inCart = cart.find(c => c.id === p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => addToCart(p)}
                disabled={outOfStock}
                className={[
                  "group flex min-h-24 self-start flex-col justify-between rounded-xl border p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)",
                  outOfStock
                    ? "cursor-not-allowed border-(--border-subtle) bg-(--canvas) opacity-40"
                    : inCart
                    ? "border-(--brand-500) bg-(--brand-50)"
                    : "border-(--border-subtle) bg-(--panel) hover:border-(--brand-500)/50 hover:bg-(--brand-50)/40 hover:shadow-sm",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-(--text-primary)">{p.name}</p>
                  </div>
                  {inCart ? (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--brand-500) text-[10px] font-bold text-white">
                      {inCart.quantity}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-(--text-muted)">Price</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-(--brand-600)">
                      {formatCurrency(p.price, currency)}
                    </p>
                  </div>
                  <span className={[
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold tabular-nums",
                    outOfStock
                      ? "border-red-200 text-red-600"
                      : p.stock <= 20
                      ? "border-amber-200 text-amber-700"
                      : "border-emerald-200 text-emerald-700",
                  ].join(" ")}>
                    {outOfStock ? "Out of stock" : `${p.stock} left`}
                  </span>
                </div>
              </button>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-(--text-muted)">
              <svg className="mb-4 size-12 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <p className="text-base font-semibold text-(--text-primary)">
                {search ? `No results for "${search}"` : "No products available"}
              </p>
              <p className="mt-1 text-sm">
                {search ? "Try a different search term." : "Add products to begin selling."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Cart ── */}
<div className="flex min-h-0 flex-col bg-(--panel) lg:w-1/3 lg:max-w-md">
        {/* Cart header */}
        <div className="flex items-center justify-between border-b border-(--border-subtle) px-4 py-4 lg:px-5">
          <h2 className="text-lg font-bold text-(--text-primary)">Current Cart</h2>
          {cart.length > 0 && (
            <span className="rounded-full bg-(--brand-500) px-2.5 py-0.5 text-xs font-bold text-white tabular-nums">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </div>

        {/* Cart items */}
<div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-5">          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-(--text-muted)">
              <svg className="size-14 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" x2="21" y1="6" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p className="text-sm font-medium text-(--text-primary)">Cart is empty</p>
              <p className="text-xs">Click a product to add it</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {cart.map(item => (
                <li key={item.id} className="flex items-start justify-between gap-3 rounded-lg border border-(--border-subtle) bg-(--canvas) p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-(--text-primary)">{item.name}</p>
                    <p className="mt-0.5 text-xs tabular-nums text-(--text-muted)">
                      {formatCurrency(item.price, currency)} × {item.quantity} = <span className="font-semibold text-(--text-primary)">{formatCurrency(item.price * item.quantity, currency)}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <div className="flex items-center overflow-hidden rounded-lg border border-(--border-subtle) bg-(--panel)">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex size-7 items-center justify-center text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text-primary) transition-colors text-base font-medium"
                      >
                        −
                      </button>
                      <span className="min-w-[1.75rem] text-center text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex size-7 items-center justify-center text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text-primary) transition-colors text-base font-medium"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Totals & checkout */}
        <div className="shrink-0 border-t border-[var(--border-subtle)] px-4 pt-4 pb-5 space-y-3 lg:px-5">
          <div className="flex justify-between text-sm text-[var(--text-muted)]">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium text-[var(--text-primary)]">{formatCurrency(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--text-muted)]">
            <span>{taxLabel} ({(taxRate * 100).toFixed(0)}%)</span>
            <span className="tabular-nums font-medium text-[var(--text-primary)]">{formatCurrency(taxAmount, currency)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border-subtle)] pt-3">
            <span className="text-base font-bold text-[var(--text-primary)]">Total</span>
            <span className="text-xl font-bold tabular-nums text-[var(--text-primary)]">{formatCurrency(totalAmount, currency)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              size="lg"
              onClick={() => handleCheckout("cash")}
              disabled={cart.length === 0 || (isCheckingOut !== null && isCheckingOut !== "cash")}
              loading={isCheckingOut === "cash"}
              className="justify-center"
            >
              Pay Cash
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => handleCheckout("card")}
              disabled={cart.length === 0 || (isCheckingOut !== null && isCheckingOut !== "card")}
              loading={isCheckingOut === "card"}
              className="justify-center"
            >
              Pay Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
