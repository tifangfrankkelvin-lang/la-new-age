"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-24 text-center">
      <h1 className="font-display text-2xl uppercase text-brand-navy mb-3">
        Something Went Wrong
      </h1>
      <p className="text-brand-mid text-sm mb-8">
        We hit an unexpected error loading this page. It's not you — try
        again, or head back to the shop.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide px-6 py-3 hover:bg-brand-orange transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/shop"
          className="text-sm text-brand-steel hover:text-brand-orange"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}