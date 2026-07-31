import Link from "next/link";
import type { Product } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/categories";

export default function PartCard({ part }: { part: Product }) {
  const bgColor = CATEGORY_COLORS[part.category] ?? "#3E5061";

  return (
    <Link
      href={`/shop/${part.slug}`}
      className="group block bg-white border border-brand-mid/20 hover:border-brand-orange transition-colors"
    >
      <div
        className="relative h-40 flex items-center justify-center"
        style={{
          backgroundColor: part.image_url ? undefined : bgColor,
        }}
      >
        {part.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={part.image_url}
            alt={part.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white" />
            <span className="text-white/80 text-xs uppercase tracking-widest font-display">
              {part.category}
            </span>
          </>
        )}
        {!part.in_stock && (
          <span className="absolute bottom-2 right-2 bg-brand-navy text-white text-[10px] uppercase tracking-wide px-2 py-1">
            Sold Out
          </span>
        )}
      </div>

      <div className="border-t border-dashed border-brand-mid/40" />

      <div className="p-4">
        <h3 className="font-display text-base text-brand-navy uppercase tracking-wide">
          {part.name}
        </h3>
        <p className="text-xs text-brand-mid mt-1">{part.fitment}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="font-mono text-[11px] text-brand-mid">
            #{part.part_number}
          </span>
          <span className="font-display text-lg text-brand-orange">
            ${part.price}
          </span>
        </div>
      </div>
    </Link>
  );
}