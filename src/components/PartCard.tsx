import Link from "next/link";
import type { Product } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/categories";

export default function PartCard({ part }: { part: Product }) {
  const bgColor = CATEGORY_COLORS[part.category] ?? "#3E5061";
  const price = Number(part.price).toFixed(2);

  return (
    <Link
      href={`/shop/${part.slug}`}
      className="group relative block overflow-hidden border border-brand-mid/20 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange hover:shadow-[0_16px_35px_rgba(27,42,56,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          backgroundColor: part.image_url ? undefined : bgColor,
        }}
      >
        {part.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={part.image_url}
            alt={part.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="h-9 w-9 rounded-full border border-white/50 bg-white/10" />
            <span className="font-display text-xs uppercase tracking-[0.18em] text-white/80">
              {part.category}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-orange scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="bg-white/95 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-navy shadow-sm">
            {part.category}
          </span>
          {!part.in_stock && (
            <span className="bg-brand-navy px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white">
              Sold Out
            </span>
          )}
        </div>

        <span className="absolute bottom-3 right-3 translate-y-2 bg-brand-orange px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View Part
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-mid">
          #{part.part_number}
        </p>
        <h3 className="font-display text-[17px] uppercase leading-tight tracking-wide text-brand-navy">
          {part.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 min-h-8 text-xs leading-relaxed text-brand-mid">
          {part.fitment}
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-brand-mid/15 pt-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-mid">
            {part.in_stock ? "In Stock" : "Unavailable"}
          </span>
          <span className="font-display text-xl text-brand-orange">
            ${price}
          </span>
        </div>
      </div>
    </Link>
  );
}
