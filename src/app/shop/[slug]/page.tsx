import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: part } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!part) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <nav className="text-xs text-brand-mid mb-6">
        <Link href="/" className="hover:text-brand-orange">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-orange">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-navy">{part.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square flex items-center justify-center bg-brand-steel">
          {part.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={part.image_url}
              alt={part.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/70 uppercase tracking-widest text-sm font-display">
              {part.category}
            </span>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-brand-orange mb-2">
            {part.category}
          </p>
          <h1 className="font-display text-3xl uppercase text-brand-navy leading-tight">
            {part.name}
          </h1>
          <p className="text-brand-mid text-sm mt-2">Fits: {part.fitment}</p>
          <p className="font-mono text-xs text-brand-mid mt-1">
            Part #{part.part_number}
          </p>

          <p className="font-display text-3xl text-brand-orange mt-6">
            ${part.price}
          </p>

          <p className="text-brand-steel text-sm leading-relaxed mt-4">
            {part.description}
          </p>

          {part.in_stock ? (
            <AddToCartButton
              id={part.id}
              slug={part.slug}
              name={part.name}
              price={part.price}
              partNumber={part.part_number}
            />
          ) : (
            <p className="mt-8 inline-block px-8 py-3 bg-brand-mid/20 text-brand-mid text-sm font-semibold uppercase tracking-wide">
              Sold Out
            </p>
          )}

          <p className="text-xs text-brand-mid mt-3">
            Shipping &amp; local LA pickup available at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}