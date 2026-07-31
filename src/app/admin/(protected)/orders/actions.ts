"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  sendCustomerCancellationEmail,
  sendAdminCancellationEmail,
} from "@/lib/email";

export async function updateOrderStatus(
  id: string,
  status: "submitted" | "placed" | "paid" | "fulfilled" | "canceled"
) {
  const supabase = createAdminClient();

  await supabase.from("orders").update({ status }).eq("id", id);

  if (status === "canceled") {
    const { data: order } = await supabase
      .from("orders")
      .select("customer_name, email")
      .eq("id", id)
      .single();

    if (order) {
      await sendCustomerCancellationEmail({
        to: order.email,
        customerName: order.customer_name,
      });
      await sendAdminCancellationEmail({
        customerName: order.customer_name,
        email: order.email,
        orderId: id,
      });
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}