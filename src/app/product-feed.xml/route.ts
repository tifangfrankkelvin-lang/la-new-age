import { createClient } from "@/lib/supabase/server";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const { data: products } = await supabase.from("products").select("*");

  const items = (products ?? [])
    .map((p) => {
      const condition = p.condition === "new" ? "new" : "used";
      const availability = p.in_stock ? "in stock" : "out of stock";

      return `
    <item>
      <g:id>${p.id}</g:id>
      <title>${escapeXml(p.name)}</title>
      <description>${escapeXml(p.description)}</description>
      <link>${baseUrl}/shop/${p.slug}</link>
      <g:image_link>${p.image_url ?? ""}</g:image_link>
      <g:condition>${condition}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price.toFixed(2)} USD</g:price>
      <g:brand>L.A New Age</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>L.A New Age Product Feed</title>
    <link>${baseUrl}</link>
    <description>Truck parts for sale from L.A New Age, Los Angeles</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}