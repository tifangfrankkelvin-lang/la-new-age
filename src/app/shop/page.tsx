import Link from "next/link";
import PartCard from "@/components/PartCard";
import { CATEGORIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (category) {
    query = query.ilike("category", category);
  }
  if (q) {
    query = query.or(`name.ilike.%${q}%,fitment.ilike.%${q}%`);
  }

  const { data: filtered } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <nav className="text-xs text-brand-mid mb-4">
        <Link href="/" className="hover:text-brand-orange">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-navy">Shop</span>
      </nav>

      <h1 className="font-display text-3xl uppercase text-brand-navy mb-2">
        Shop All Parts
      </h1>
      <p className="text-brand-mid text-sm mb-8">
        {filtered?.length ?? 0} {filtered?.length === 1 ? "part" : "parts"} found
      </p>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <aside>
          <form method="GET" className="mb-8">
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-2">
              Search
            </label>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="e.g. brake rotor, F-150"
              className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
            />
            {category && <input type="hidden" name="category" value={category} />}
            <button
              type="submit"
              className="mt-2 w-full bg-brand-navy text-white text-xs font-semibold uppercase tracking-wide py-2 hover:bg-brand-orange transition-colors"
            >
              Search
            </button>
          </form>

          <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-3">
            Category
          </h2>
          <ul className="space-y-1">
            <li>
              <Link
                href={q ? `/shop?q=${q}` : "/shop"}
                className={`block text-sm py-1.5 uppercase tracking-wide ${
                  !category
                    ? "text-brand-orange font-semibold"
                    : "text-brand-steel hover:text-brand-orange"
                }`}
              >
                All
              </Link>
            </li>
            {CATEGORIES.map((cat) => {
              const isActive = category?.toLowerCase() === cat.toLowerCase();
              const href = q
                ? `/shop?category=${cat.toLowerCase()}&q=${q}`
                : `/shop?category=${cat.toLowerCase()}`;
              return (
                <li key={cat}>
                  <Link
                    href={href}
                    className={`block text-sm py-1.5 uppercase tracking-wide ${
                      isActive
                        ? "text-brand-orange font-semibold"
                        : "text-brand-steel hover:text-brand-orange"
                    }`}
                  >
                    {cat}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <div>
          {!filtered || filtered.length === 0 ? (
            <div className="border border-dashed border-brand-mid/40 py-16 text-center">
              <p className="font-display text-lg uppercase text-brand-navy mb-1">
                No parts match that search
              </p>
              <p className="text-sm text-brand-mid">
                Try a different keyword, or{" "}
                <Link href="/shop" className="text-brand-orange underline">
                  view all parts
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}