"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/app/order/[token]/actions";

export default function CancelOrderButton({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel this order? This can't be undone.")) return;

    setCanceling(true);
    const result = await cancelOrder(token);
    setCanceling(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={canceling}
        className="w-full border border-red-600 text-red-600 text-sm font-semibold uppercase tracking-wide py-3 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {canceling ? "Canceling..." : "Cancel This Order"}
      </button>
      {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
    </div>
  );
}