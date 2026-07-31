"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-mid/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-brand-navy uppercase hover:text-brand-orange transition-colors"
        >
          L.A New Age
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide uppercase text-brand-steel hover:text-brand-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
         <Link
            href="/cart"
            className="relative text-brand-steel hover:text-brand-orange transition-colors"
            aria-label="View cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/order-status"
            className="text-sm font-semibold uppercase tracking-wide border border-brand-navy text-brand-navy px-4 py-2 hover:bg-brand-navy hover:text-white transition-colors"
          >
            Track Order
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-brand-navy"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            {menuOpen ? (
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6H21M3 12H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-brand-mid/20 bg-white">
          <div className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm font-medium uppercase tracking-wide text-brand-steel border-b border-brand-mid/10"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="py-3 text-sm font-medium uppercase tracking-wide text-brand-steel border-b border-brand-mid/10"
              onClick={() => setMenuOpen(false)}
            >
              Cart{itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
            <Link
              href="/order-status"
              className="py-3 text-sm font-semibold uppercase tracking-wide text-brand-orange"
              onClick={() => setMenuOpen(false)}
            >
              Track Order
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}