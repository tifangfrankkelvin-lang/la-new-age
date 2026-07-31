"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
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
    <div className="max-w-lg py-16 text-center">
      <h1 className="font-display text-2xl uppercase text-brand-navy mb-3">
        Something Went Wrong
      </h1>
      <p className="text-brand-mid text-sm mb-8">
        There was an error loading this admin page.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide px-6 py-3 hover:bg-brand-orange transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="text-sm text-brand-steel hover:text-brand-orange"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}