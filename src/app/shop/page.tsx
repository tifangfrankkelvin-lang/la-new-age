import Link from "next/link";
import PartCard from "@/components/PartCard";
import { CATEGORIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Truck Parts | L.A New Age",
  description:
    "Browse truck parts in Los Angeles — brakes, suspension, lighting, engine parts, and more. Shipping and local pickup available.",
};

// Keep the customer-facing category label stable while accepting the common
// legacy spellings that may already exist in the products table.
const CATEGORY_ALIASES: Record<string, string[]> = {
  "Body & Mirrors": [
    "Body & Mirrors",
    "Body and Mirrors",
    "Body/Mirrors",
    "Body & Mirror",
    "Body",
    "Mirrors",
  ],
};

function getCategoryFilter(category: string) {
  const canonical = CATEGORIES.find(
    (item) => item.toLowerCase() === category.toLowerCase(),
  );

  if (!canonical) return null;

  return CATEGORY_ALIASES[canonical] ?? [canonical];
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    const categoryValues = getCategoryFilter(category);

    if (categoryValues) {
      query =
        categoryValues.length === 1
          ? query.ilike("category", categoryValues[0])
          : query.or(
              categoryValues
                .map((value) => `category.ilike.${value}`)
                .join(","),
            );
    }
  }

  if (q) {
    query = query.or(`name.ilike.%${q}%,fitment.ilike.%${q}%`);
  }

  const { data: filtered } = await query;
  const count = filtered?.length ?? 0;

  return (
    <div className="bg-brand-light/40">
      <section className="border-b border-brand-mid/15 bg-brand-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <nav className="mb-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            <Link href="/" className="transition-colors hover:text-brand-orange">
              Home
            </Link>
            <span className="mx-2 text-white/25">/</span>
            <span className="text-white/80">Shop</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
                L.A. New Age Parts Department
              </p>
              <h1 className="font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
                Shop the parts.
                <br />
                <span className="text-white/45">Build the truck.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                Quality truck parts sourced in Los Angeles. Find what you need,
                order online, and choose shipping or local pickup.
              </p>
            </div>
            <div className="shrink-0 border-l border-white/15 pl-5 md:text-right">
              <p className="font-display text-3xl text-brand-orange">{count}</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                {count === 1 ? "Part available" : "Parts available"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10">
        <div className="mb-8 overflow-x-auto pb-1 [scrollbar-width:none]">
          <div className="flex min-w-max gap-2">
            <Link
              href={q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"}
              className={`border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                !category
                  ? "border-brand-orange bg-brand-orange text-white"
                  : "border-brand-mid/25 bg-white text-brand-steel hover:border-brand-orange hover:text-brand-orange"
              }`}
            >
              All Parts
            </Link>
            {CATEGORIES.map((cat) => {
              const isActive = category?.toLowerCase() === cat.toLowerCase();
              const href = q
                ? `/shop?category=${encodeURIComponent(cat.toLowerCase())}&q=${encodeURIComponent(q)}`
                : `/shop?category=${encodeURIComponent(cat.toLowerCase())}`;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    isActive
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-brand-mid/25 bg-white text-brand-steel hover:border-brand-orange hover:text-brand-orange"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
          <aside className="self-start lg:sticky lg:top-24">
            <div className="border border-brand-mid/15 bg-white p-5 shadow-[0_8px_25px_rgba(27,42,56,0.04)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
                    Refine
                  </p>
                  <h2 className="mt-1 font-display text-xl uppercase text-brand-navy">
                    Find a part
                  </h2>
                </div>
                {(q || category) && (
                  <Link
                    href="/shop"
                    className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-mid hover:text-brand-orange"
                  >
                    Clear
                  </Link>
                )}
              </div>

              <form method="GET">
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-mid">
                  Search parts
                </label>
                <div className="flex border border-brand-mid/25 bg-brand-light/40 focus-within:border-brand-orange">
                  <input
                    type="search"
                    name="q"
                    defaultValue={q ?? ""}
                    placeholder="Brake rotor, F-150..."
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-brand-navy outline-none placeholder:text-brand-mid/60"
                  />
                  {category && <input type="hidden" name="category" value={category} />}
                  <button
                    type="submit"
                    aria-label="Search parts"
                    className="px-3 text-brand-navy transition-colors hover:text-brand-orange"
                  >
                    →
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-brand-mid/15 pt-5">
                <h3 className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-mid">
                  Category
                </h3>
                <ul className="space-y-0.5">
                  {CATEGORIES.map((cat) => {
                    const isActive = category?.toLowerCase() === cat.toLowerCase();
                    const href = q
                      ? `/shop?category=${encodeURIComponent(cat.toLowerCase())}&q=${encodeURIComponent(q)}`
                      : `/shop?category=${encodeURIComponent(cat.toLowerCase())}`;
                    return (
                      <li key={cat}>
                        <Link
                          href={href}
                          className={`flex items-center justify-between border-b border-brand-mid/10 py-2.5 text-xs uppercase tracking-wide transition-colors ${
                            isActive
                              ? "font-semibold text-brand-orange"
                              : "text-brand-steel hover:pl-1 hover:text-brand-orange"
                          }`}
                        >
                          {cat}
                          <span className="text-brand-mid/50">→</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="mt-4 border-l-2 border-brand-orange bg-white px-4 py-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-navy">
                Need fitment help?
              </p>
              <Link
                href="/contact"
                className="mt-1 block text-xs text-brand-mid hover:text-brand-orange"
              >
                Talk to the parts team →
              </Link>
            </div>
          </aside>

          <main>
            <div className="mb-5 flex items-center justify-between border-b border-brand-mid/15 pb-4">
              <div>
                <p className="font-display text-lg uppercase text-brand-navy">
                  {category ? category : q ? `Results for “${q}”` : "All Parts"}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-brand-mid">
                  {count} {count === 1 ? "result" : "results"}
                </p>
              </div>
              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-mid sm:block">
                Latest additions first
              </span>
            </div>

            {!filtered || filtered.length === 0 ? (
              <div className="border border-dashed border-brand-mid/30 bg-white px-6 py-20 text-center">
                <p className="font-display text-2xl uppercase text-brand-navy">
                  No parts match
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-brand-mid">
                  Try a different keyword or browse the full parts catalog.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex bg-brand-navy px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-orange"
                >
                  View all parts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                {filtered.map((part) => (
                  <PartCard key={part.id} part={part} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
