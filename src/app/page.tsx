import Link from "next/link";
import PartCard from "@/components/PartCard";
import { CATEGORIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: parts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div>
      {/* HERO */}
      <section className="bg-brand-light border-b border-brand-mid/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl uppercase leading-tight text-brand-navy">
              Find the right part.
              <br />
              <span className="text-brand-orange">Fast.</span>
            </h1>
            <p className="mt-4 text-brand-steel max-w-md">
              Quality truck parts sourced and sold out of Los Angeles.
              Shipping nationwide, or pick up locally.
            </p>

            <div className="mt-8 bg-white border border-brand-mid/30 p-5 max-w-md">
              <p className="text-xs uppercase tracking-widest text-brand-mid mb-3">
                Find parts for your truck
              </p>
              <div className="grid grid-cols-3 gap-2">
                <select className="border border-brand-mid/30 text-sm px-2 py-2 text-brand-steel">
                  <option>Make</option>
                </select>
                <select className="border border-brand-mid/30 text-sm px-2 py-2 text-brand-steel">
                  <option>Model</option>
                </select>
                <select className="border border-brand-mid/30 text-sm px-2 py-2 text-brand-steel">
                  <option>Year</option>
                </select>
              </div>
              <Link
                href="/shop"
                className="mt-3 block text-center bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide py-2.5 hover:bg-brand-orange transition-colors"
              >
                Find Parts
              </Link>
            </div>

            <p className="mt-4 text-xs text-brand-mid">
              Shipping &amp; local LA pickup available · Secure order process
            </p>
          </div>

          <div className="hidden md:block">
            <div className="aspect-square bg-brand-steel/90 flex items-center justify-center">
              <span className="font-display text-white/60 uppercase tracking-widest text-sm">
                Featured Part Photo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl uppercase text-brand-navy mb-6">
          Browse by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${cat.toLowerCase()}`}
              className="px-4 py-2 border border-brand-mid/30 text-sm uppercase tracking-wide text-brand-steel hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl uppercase text-brand-navy">
            New Arrivals
          </h2>
          <Link
            href="/shop"
            className="text-sm font-semibold uppercase tracking-wide text-brand-orange hover:underline"
          >
            View All
          </Link>
        </div>
        {parts && parts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {parts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-mid">
            No parts listed yet — check back soon.
          </p>
        )}
      </section>

      {/* TRUST STRIP */}
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-lg uppercase mb-1">LA-Based</p>
            <p className="text-sm text-white/70">
              Local pickup available for buyers in the Los Angeles area.
            </p>
          </div>
          <div>
            <p className="font-display text-lg uppercase mb-1">
              Simple Ordering
            </p>
            <p className="text-sm text-white/70">
              Submit your order, get payment instructions by email, done.
            </p>
          </div>
          <div>
            <p className="font-display text-lg uppercase mb-1">
              Real Parts People
            </p>
            <p className="text-sm text-white/70">
              Questions about fitment? Reach out before you buy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}