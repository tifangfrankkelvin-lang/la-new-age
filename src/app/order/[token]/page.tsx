import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import CancelOrderButton from "@/components/CancelOrderButton";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Order Received",
  placed: "Payment Instructions Sent",
  paid: "Payment Received",
  fulfilled: "Shipped / Ready for Pickup",
  canceled: "Canceled",
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  submitted:
    "We've received your order. We'll email you payment instructions shortly.",
  placed:
    "Check your email for payment instructions. Once we receive payment, we'll update this page.",
  paid: "Payment received — we're preparing your order.",
  fulfilled: "Your order is on its way, or ready for pickup.",
  canceled: "This order has been canceled.",
};

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("token", token)
    .single();

  if (!order) {
    notFound();
  }

  const total = order.order_items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const canCancel = order.status === "submitted" || order.status === "placed";

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-brand-mid mb-2">
        Order #{order.order_number}
      </p>
      <h1 className="font-display text-3xl uppercase text-brand-navy mb-1">
        {STATUS_LABELS[order.status]}
      </h1>
      <p className="text-brand-steel text-sm mb-8">
        {STATUS_DESCRIPTIONS[order.status]}
      </p>

      <div className="border border-brand-mid/20 p-5 mb-6">
        <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-3">
          Items
        </h2>
        <div className="space-y-2 mb-4">
          {order.order_items.map(
            (item: {
              id: string;
              product_name: string;
              part_number: string;
              price: number;
              quantity: number;
            }) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-brand-steel">
                  {item.product_name} × {item.quantity}
                  <span className="font-mono text-xs text-brand-mid ml-2">
                    #{item.part_number}
                  </span>
                </span>
                <span className="text-brand-navy">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            )
          )}
        </div>
        <div className="border-t border-brand-mid/20 pt-3 flex justify-between font-display text-lg">
          <span className="text-brand-navy">Total</span>
          <span className="text-brand-orange">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border border-brand-mid/20 p-5 mb-6 text-sm text-brand-steel space-y-1">
        <p>
          <span className="text-brand-mid">Name:</span> {order.customer_name}
        </p>
        <p>
          <span className="text-brand-mid">Email:</span> {order.email}
        </p>
        <p>
          <span className="text-brand-mid">
            {order.shipping_type === "shipping" ? "Shipping to:" : "Fulfillment:"}
          </span>{" "}
          {order.shipping_type === "shipping"
            ? order.shipping_address
            : "Local pickup (LA)"}
        </p>
        <p>
          <span className="text-brand-mid">Payment method:</span>{" "}
          {order.payment_method === "Other"
            ? order.payment_method_other
            : order.payment_method}
        </p>
      </div>

      {canCancel && <CancelOrderButton token={token} />}

      <p className="text-xs text-brand-mid mt-6 text-center">
        Bookmark this page — it's the link to check your order status anytime.
      </p>

      <div className="text-center mt-4">
        <Link href="/shop" className="text-sm text-brand-orange hover:underline">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}