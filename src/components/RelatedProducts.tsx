import Link from "next/link";
import PartCard from "@/components/PartCard";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export default async function RelatedProducts({
  currentProductId,
  category,
}: {
  currentProductId: string;
  category: string;
}) {
  const supabase = await createClient();
  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", currentProductId)
    .limit(4);

  if (!related || related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-brand-mid/20 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl uppercase text-brand-navy">
          More {category}
        </h2>
        <Link
          href={`/shop?category=${encodeURIComponent(category.toLowerCase())}`}
          className="text-sm font-semibold uppercase tracking-wide text-brand-orange hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((part: Product) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>
    </section>
  );
}