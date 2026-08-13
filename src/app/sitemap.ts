import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at");

  const productUrls = (products ?? []).map((p) => ({
    url: `${baseUrl}/shop/${p.slug}`,
    lastModified: new Date(p.created_at),
  }));

  return [
    { url: baseUrl },
    { url: `${baseUrl}/shop` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/faq` },
    { url: `${baseUrl}/returns` },
    ...productUrls,
  ];
}