import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartButton from "@/components/AddToCartButton";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: part } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!part) {
    return { title: "Part Not Found | L.A New Age" };
  }

  const title = `${part.name} — ${part.fitment} | L.A New Age`;
  const description = `${part.name} for ${part.fitment}. Part #${part.part_number}. $${part.price}. ${part.description}`.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: part.image_url ? [part.image_url] : [],
    },
  };
}
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

  const { data: gallery } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", part.id)
    .order("sort_order", { ascending: true });

  // Cover photo first, then the rest of the gallery, no duplicates
  const galleryUrls = (gallery ?? []).map((img) => img.image_url);
  const allImages = part.image_url
    ? [part.image_url, ...galleryUrls.filter((url) => url !== part.image_url)]
    : galleryUrls;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: part.name,
    description: part.description,
    sku: part.part_number,
    image: allImages.length > 0 ? allImages : undefined,
    brand: {
      "@type": "Brand",
      name: "L.A New Age",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/${part.slug}`,
      priceCurrency: "USD",
      price: part.price,
      availability: part.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition:
        part.condition === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        <ProductGallery images={allImages} productName={part.name} />

        <div>
          <p className="text-xs uppercase tracking-widest text-brand-orange mb-2">
            {part.category} · {part.condition === "new" ? "New" : "Used"}
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