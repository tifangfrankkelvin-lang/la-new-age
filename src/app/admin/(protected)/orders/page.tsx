import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-yellow-100 text-yellow-800",
  placed: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  fulfilled: "bg-brand-navy text-white",
  canceled: "bg-red-100 text-red-700",
};

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(price, quantity)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-brand-navy mb-6">
        Orders
      </h1>

      <div className="border border-brand-mid/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-brand-light text-left text-xs uppercase tracking-wide text-brand-mid">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              const total = order.order_items.reduce(
                (sum: number, item: { price: number; quantity: number }) =>
                  sum + item.price * item.quantity,
                0
              );
              return (
                <tr key={order.id} className="border-t border-brand-mid/10">
                  <td className="px-4 py-3 text-brand-mid font-mono text-xs">
                    #{order.order_number}
                  </td>
                  <td className="px-4 py-3 text-brand-navy font-medium">
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-3 text-brand-steel">{order.email}</td>
                  <td className="px-4 py-3 text-brand-steel">
                    ${total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-brand-steel">
                    {order.payment_method === "Other"
                      ? order.payment_method_other
                      : order.payment_method}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs uppercase px-2 py-1 ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-mid text-xs">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brand-orange text-xs font-semibold uppercase hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <p className="px-4 py-8 text-center text-brand-mid text-sm">
            No orders yet.
          </p>
        )}
      </div>
    </div>
  );
}