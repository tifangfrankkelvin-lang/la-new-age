import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import OrderStatusControls from "@/components/OrderStatusControls";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) {
    notFound();
  }

  const total = order.order_items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/orders"
        className="text-xs text-brand-mid hover:text-brand-orange"
      >
        ← Back to Orders
      </Link>

      <h1 className="font-display text-3xl uppercase text-brand-navy mt-3 mb-6">
        Order #{order.order_number}
      </h1>

      <div className="border border-brand-mid/20 p-5 mb-6 text-sm text-brand-steel space-y-1">
        <p><span className="text-brand-mid">Name:</span> {order.customer_name}</p>
        <p><span className="text-brand-mid">Email:</span> {order.email}</p>
        <p>
          <span className="text-brand-mid">
            {order.shipping_type === "shipping" ? "Shipping to:" : "Fulfillment:"}
          </span>{" "}
          {order.shipping_type === "shipping" ? order.shipping_address : "Local pickup (LA)"}
        </p>
        <p>
          <span className="text-brand-mid">Payment method:</span>{" "}
          {order.payment_method === "Other" ? order.payment_method_other : order.payment_method}
        </p>
        {order.note && (
          <p><span className="text-brand-mid">Note:</span> {order.note}</p>
        )}
      </div>

      <div className="border border-brand-mid/20 p-5 mb-6">
        <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-3">Items</h2>
        <div className="space-y-2 mb-4">
          {order.order_items.map(
            (item: { id: string; product_name: string; part_number: string; price: number; quantity: number }) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product_name} × {item.quantity}{" "}
                  <span className="font-mono text-xs text-brand-mid">#{item.part_number}</span>
                </span>
                <span className="text-brand-navy">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            )
          )}
        </div>
        <div className="border-t border-brand-mid/20 pt-3 flex justify-between font-display text-lg">
          <span className="text-brand-navy">Total</span>
          <span className="text-brand-orange">${total.toFixed(2)}</span>
        </div>
      </div>

      <OrderStatusControls orderId={order.id} currentStatus={order.status} />
    </div>
  );
}