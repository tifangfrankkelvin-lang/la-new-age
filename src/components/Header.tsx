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
    <header className="sticky top-0 z-50 border-b border-brand-mid/15 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="L.A New Age home"
        >
          <span className="flex h-8 w-8 items-center justify-center bg-brand-navy font-display text-sm text-white transition-colors group-hover:bg-brand-orange">LA</span>
          <span className="font-display text-xl uppercase tracking-wide text-brand-navy transition-colors group-hover:text-brand-orange sm:text-2xl">
            L.A New Age
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-[0.14em] text-brand-steel transition-colors hover:text-brand-orange"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="relative text-brand-steel transition-colors hover:text-brand-orange"
            aria-label={`View cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.7a2 2 0 002-1.6L21 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/order-status"
            className="border border-brand-navy px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-navy transition hover:bg-brand-navy hover:text-white"
          >
            Track order
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative text-brand-navy" aria-label={`View cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.7a2 2 0 002-1.6L21 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {itemCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[9px] font-bold text-white">{itemCount}</span>}
          </Link>
          <button
            className="text-brand-navy"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-brand-mid/15 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-brand-mid/10 py-4 text-xs font-bold uppercase tracking-[0.14em] text-brand-steel transition-colors hover:text-brand-orange"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/order-status" className="py-4 text-xs font-bold uppercase tracking-[0.14em] text-brand-orange" onClick={() => setMenuOpen(false)}>
              Track order
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
