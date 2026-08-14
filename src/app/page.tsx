import Link from "next/link";
import PartCard from "@/components/PartCard";
import { CATEGORIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

const CATEGORY_META: Record<string, { eyebrow: string; description: string }> = {
  Brakes: { eyebrow: "Control", description: "Stopping power, pads, rotors, and hardware." },
  Suspension: { eyebrow: "Ride", description: "Components built for confident handling." },
  Engine: { eyebrow: "Performance", description: "Keep your truck working at its best." },
  Lighting: { eyebrow: "Visibility", description: "Headlights, taillights, and lighting assemblies." },
  Exhaust: { eyebrow: "Airflow", description: "Exhaust systems and related hardware." },
  "Body & Mirrors": { eyebrow: "Exterior", description: "Mirrors, bumpers, and exterior body parts." },
};

export default async function Home() {
  const supabase = await createClient();
  const { data: parts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "L.A New Age",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description:
      "Quality truck parts sourced and sold out of Los Angeles, with nationwide shipping and local pickup.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "L.A New Age",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* HERO */}
      <section className="relative bg-brand-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(232,93,37,0.18),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:py-20 lg:gap-16 lg:py-24">
          <div>
            <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              <span className="h-px w-8 bg-brand-orange" />
              Los Angeles · Truck Parts
            </div>
            <h1 className="max-w-xl font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Parts that keep your truck <span className="text-brand-orange">moving.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
              Quality truck parts, sourced in Los Angeles and ready to ship nationwide or pick up locally.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-brand-navy"
              >
                Shop all parts
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-white/25 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
              >
                Need help finding a part?
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-xs uppercase tracking-wider text-white/50">
              <span>Nationwide shipping</span>
              <span>Local LA pickup</span>
              <span>Real parts support</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 border border-brand-orange/25" />
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-steel sm:aspect-square">
              <Image
                src="/storefront.jpeg"
                alt="L.A New Age storefront in Los Angeles"
                fill
                className="object-cover transition duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 border-l-2 border-brand-orange pl-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Since day one</p>
                <p className="mt-1 font-display text-xl uppercase text-white">Built around trucks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK VALUE STRIP */}
      <section className="border-b border-brand-mid/15 bg-white">
        <div className="mx-auto grid max-w-6xl divide-y divide-brand-mid/15 px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
        {[
            ["01", "Know what you need?", "Go straight to the parts catalog.", "/shop"],
            ["02", "Not sure what fits?", "Talk to us before you order.", "/contact"],
            ["03", "Ready to buy?", "Order online and choose shipping or pickup.", "/shop"],
          ].map(([number, title, text, href]) => (
            <Link
              key={number}
              href={href}
              className="group flex gap-4 py-6 transition-colors md:px-7 md:first:pl-0 md:last:pr-0"
            >
              <span className="font-display text-sm text-brand-orange">{number}</span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-brand-navy transition-colors group-hover:text-brand-orange">
                  {title}
                </p>
                <p className="mt-1 text-sm leading-5 text-brand-mid">{text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">Start here</p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-brand-navy sm:text-4xl">Shop by category</h2>
          </div>
          <Link href="/shop" className="hidden text-sm font-bold uppercase tracking-wider text-brand-navy transition hover:text-brand-orange sm:block">
            View catalog →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {CATEGORIES.map((cat, index) => {
            const meta = CATEGORY_META[cat] ?? { eyebrow: `Category ${String(index + 1).padStart(2, "0")}`, description: "Browse available truck parts." };
            return (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat.toLowerCase())}`}
                className="group relative min-h-40 overflow-hidden border border-brand-mid/20 bg-brand-light p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-orange hover:shadow-[0_16px_35px_rgba(27,42,56,0.10)] sm:min-h-48 sm:p-6"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">{meta.eyebrow}</span>
                <h3 className="mt-3 font-display text-2xl uppercase text-brand-navy">{cat}</h3>
                <p className="mt-2 max-w-xs text-xs leading-5 text-brand-mid sm:text-sm">{meta.description}</p>
                <span className="absolute bottom-5 right-5 text-xl text-brand-navy transition group-hover:translate-x-1 group-hover:text-brand-orange" aria-hidden>↗</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-brand-light/70 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">Fresh inventory</p>
              <h2 className="font-display text-3xl uppercase tracking-tight text-brand-navy sm:text-4xl">New arrivals</h2>
            </div>
            <Link href="/shop" className="text-sm font-bold uppercase tracking-wider text-brand-navy transition hover:text-brand-orange">
              View all →
            </Link>
          </div>
          {parts && parts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {parts.map((part) => <PartCard key={part.id} part={part} />)}
            </div>
          ) : (
            <div className="border border-dashed border-brand-mid/30 bg-white p-10 text-center">
              <p className="text-sm text-brand-mid">No parts listed yet — check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* BRAND CTA */}
      <section className="bg-brand-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-end md:py-20">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">Can&apos;t find it?</p>
            <h2 className="max-w-2xl font-display text-4xl uppercase leading-none sm:text-5xl">Tell us what your truck needs.</h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/65 sm:text-base">Questions about fitment or a part that isn&apos;t listed? Reach out and we&apos;ll help you find the right option.</p>
          </div>
          <Link href="/contact" className="inline-flex items-center justify-center border border-white/30 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition hover:border-brand-orange hover:bg-brand-orange">
            Contact us →
          </Link>
        </div>
      </section>
    </div>
  );
}
