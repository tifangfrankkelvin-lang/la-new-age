"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl uppercase text-brand-navy mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-brand-mid text-sm mb-6">
          Browse our parts and add something to get started.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide px-6 py-3 hover:bg-brand-orange transition-colors"
        >
          Shop Parts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl uppercase text-brand-navy mb-8">
        Your Cart
      </h1>

      <div className="border border-brand-mid/20 divide-y divide-brand-mid/10">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap sm:flex-nowrap items-center justify-between p-4 gap-4"
          >
            <div className="flex-1 min-w-[140px]">
              <Link
                href={`/shop/${item.slug}`}
                className="font-display text-base uppercase text-brand-navy hover:text-brand-orange transition-colors"
              >
                {item.name}
              </Link>
              <p className="font-mono text-xs text-brand-mid mt-1">
                #{item.partNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity - 1)
                }
                className="w-7 h-7 border border-brand-mid/30 text-brand-steel hover:border-brand-orange"
              >
                –
              </button>
              <span className="w-6 text-center text-sm">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
                className="w-7 h-7 border border-brand-mid/30 text-brand-steel hover:border-brand-orange"
              >
                +
              </button>
            </div>

            <span className="font-display text-brand-orange w-16 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </span>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-600 text-xs font-semibold uppercase hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <Link
          href="/shop"
          className="text-sm text-brand-steel hover:text-brand-orange"
        >
          ← Continue Shopping
        </Link>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-brand-mid mb-1">
            Subtotal
          </p>
          <p className="font-display text-2xl text-brand-navy">
            ${subtotal.toFixed(2)}
          </p>
        </div>
      </div>

      <Link
        href="/order"
        className="mt-6 block text-center bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide py-3.5 hover:bg-brand-orange transition-colors"
      >
        Continue to Order
      </Link>
    </div>
  );
}