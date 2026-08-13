import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at, updated_at");

  const productUrls = (products ?? []).map((p) => ({
    url: `${baseUrl}/shop/${p.slug}`,
    lastModified: new Date(p.updated_at ?? p.created_at),
  }));

  const now = new Date();

  return [
    { url: baseUrl, lastModified: now },
    { url: `${baseUrl}/shop`, lastModified: now },
    { url: `${baseUrl}/about`, lastModified: now },
    { url: `${baseUrl}/contact`, lastModified: now },
    { url: `${baseUrl}/faq`, lastModified: now },
    { url: `${baseUrl}/returns`, lastModified: now },
    ...productUrls,
  ];
}