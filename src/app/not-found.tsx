import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-24 text-center">
      <p className="font-display text-6xl text-brand-orange mb-4">404</p>
      <h1 className="font-display text-2xl uppercase text-brand-navy mb-3">
        Part Not Found
      </h1>
      <p className="text-brand-mid text-sm mb-8">
        The page you're looking for doesn't exist, or the part may have sold
        out and been removed.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide px-6 py-3 hover:bg-brand-orange transition-colors"
      >
        Browse All Parts
      </Link>
    </div>
  );
}