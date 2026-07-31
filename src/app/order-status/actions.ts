"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderLookupEmail } from "@/lib/email";

export async function requestOrderLinks(email: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("token, created_at, order_items(price, quantity)")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (orders && orders.length > 0) {
    const formatted = orders.map((o) => ({
      token: o.token,
      createdAt: o.created_at,
      total: o.order_items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      ),
    }));

    await sendOrderLookupEmail({ to: email, orders: formatted });
  }

  // Intentionally no return value indicating whether anything was found —
  // the page always shows the same message either way.
}