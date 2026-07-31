"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/admin/(protected)/orders/actions";

const STATUSES = [
  { value: "submitted", label: "Order Received" },
  { value: "placed", label: "Placed (Payment Sent)" },
  { value: "paid", label: "Paid" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "canceled", label: "Canceled" },
] as const;

export default function OrderStatusControls({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleChange(status: (typeof STATUSES)[number]["value"]) {
    setUpdating(true);
    await updateOrderStatus(orderId, status);
    setUpdating(false);
    router.refresh();
  }

  return (
    <div className="border border-brand-mid/20 p-5">
      <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-3">
        Order Status
      </h2>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => handleChange(s.value)}
            disabled={updating}
            className={`text-xs uppercase tracking-wide px-3 py-2 border disabled:opacity-50 ${
              currentStatus === s.value
                ? "bg-brand-navy text-white border-brand-navy"
                : "border-brand-mid/30 text-brand-steel hover:border-brand-orange hover:text-brand-orange"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}