"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  taxLabel: string; // e.g. "GST" or "VAT"
  currency: string; 
  checkoutAction: (data: CheckoutData) => Promise<void>;
};

export function SalesClient({ initialProducts, taxRate, taxLabel, currency, checkoutAction }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
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
      alert(`Sale completed via ${paymentType}!`);
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
      alert("Checkout failed.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: Products */}
      <div className="w-2/3 p-6 flex flex-col border-r border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Products Checkout</h1>
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-brand shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-6">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className="border border-gray-200 bg-white p-5 rounded-xl cursor-pointer hover:shadow-md hover:border-brand transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{p.name}</h3>
                <p className="text-brand font-medium mt-1">{currency}{p.price.toFixed(2)}</p>
              </div>
              <div className="mt-4">
                <span className={`text-sm px-2 py-1 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </div>
          ))}
{filteredProducts.length === 0 && (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-500">
    <p className="text-lg font-medium">
      {search
        ? `No products found for ${search}`
        : "No products available"}
    </p>

    <p className="text-sm mt-2 text-gray-400">
      {search
        ? "Try a different search term."
        : "Add products to begin selling."}
    </p>
  </div>
)}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-1/3 p-6 flex flex-col bg-white shadow-lg z-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Current Cart</h2>
        <div className="flex-1 overflow-y-auto pr-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <p className="text-lg">Cart is empty</p>
              <p className="text-sm mt-1">Click a product to add it</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-gray-500 text-sm mt-1">{currency}{item.price.toFixed(2)} each</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition-colors">-</button>
                    <span className="px-3 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition-colors">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 hover:underline text-xs font-medium transition-colors">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 mt-4">
          <div className="flex justify-between mb-3 text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>{taxLabel} ({(taxRate * 100).toFixed(0)}%)</span>
            <span className="font-medium text-gray-900">{currency}{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-2xl mb-8 text-gray-900">
            <span>Total</span>
            <span>{currency}{totalAmount.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleCheckout("cash")}
              disabled={cart.length === 0}
              className="bg-brand text-brandText py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-[0.98]"
            >
              Pay Cash
            </button>
            <button
              onClick={() => handleCheckout("card")}
              disabled={cart.length === 0}
              className="bg-gray-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-[0.98]"
            >
              Pay Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
