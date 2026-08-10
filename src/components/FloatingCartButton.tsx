"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function FloatingCartButton() {
  const pathname = usePathname();
  const { items } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Hide on the cart/order pages themselves, and in the admin dashboard
  const hiddenOn = ["/cart", "/order", "/admin"];
  const shouldHide =
    itemCount === 0 || hiddenOn.some((path) => pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-brand-navy text-white px-5 py-3.5 shadow-lg hover:bg-brand-orange transition-colors md:hidden"
      aria-label="View cart"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.7a2 2 0 002-1.6L21 8H6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.4" fill="currentColor" />
        <circle cx="17" cy="20" r="1.4" fill="currentColor" />
      </svg>
      <span className="text-sm font-semibold uppercase tracking-wide">
        Cart ({itemCount})
      </span>
    </Link>
  );
}