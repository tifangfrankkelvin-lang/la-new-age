"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  id,
  slug,
  name,
  price,
  partNumber,
}: {
  id: string;
  slug: string;
  name: string;
  price: number;
  partNumber: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ id, slug, name, price, partNumber });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className="mt-8 w-full md:w-auto px-8 py-3 bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide hover:bg-brand-orange transition-colors"
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}