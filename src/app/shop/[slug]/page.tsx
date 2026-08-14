import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartButton from "@/components/AddToCartButton";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

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
    alternates: { canonical: `/shop/${part.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/shop/${part.slug}`,
      siteName: "L.A New Age",
      images: part.image_url ? [part.image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
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

  const galleryUrls = (gallery ?? []).map((img) => img.image_url);
  const allImages = part.image_url
    ? [part.image_url, ...galleryUrls.filter((url) => url !== part.image_url)]
    : galleryUrls;

  const productUrl = `${siteUrl}/shop/${part.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: part.name,
    description: part.description,
    sku: part.part_number,
    image: allImages.length > 0 ? allImages : undefined,
    brand: { "@type": "Brand", name: "L.A New Age" },
    category: part.category,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: part.price,
      availability: part.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition:
        part.condition === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
      seller: { "@type": "Organization", name: "L.A New Age", url: siteUrl },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
      { "@type": "ListItem", position: 3, name: part.name, item: productUrl },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-mid">
        <Link href="/" className="hover:text-brand-orange">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-orange">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-brand-navy">{part.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={allImages} productName={part.name} />

        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-brand-orange">
            {part.category} · {part.condition === "new" ? "New" : "Used"}
          </p>
          <h1 className="font-display text-3xl uppercase leading-tight text-brand-navy">{part.name}</h1>
          <p className="mt-2 text-sm text-brand-mid">Fits: {part.fitment}</p>
          <p className="mt-1 font-mono text-xs text-brand-mid">Part #{part.part_number}</p>
          <p className="mt-6 font-display text-3xl text-brand-orange">${part.price}</p>
          <p className="mt-4 text-sm leading-relaxed text-brand-steel">{part.description}</p>

          {part.in_stock ? (
            <AddToCartButton id={part.id} slug={part.slug} name={part.name} price={part.price} partNumber={part.part_number} />
          ) : (
            <p className="mt-8 inline-block bg-brand-mid/20 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-brand-mid">Sold Out</p>
          )}

          <p className="mt-3 text-xs text-brand-mid">Shipping &amp; local LA pickup available at checkout.</p>
        </div>
      </div>
    </div>
  );
}