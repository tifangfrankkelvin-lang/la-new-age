"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  sendCustomerCancellationEmail,
  sendAdminCancellationEmail,
} from "@/lib/email";

export async function cancelOrder(token: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, customer_name, email")
    .eq("token", token)
    .single();

  if (!order) {
    return { error: "Order not found." };
  }

  if (order.status === "paid" || order.status === "fulfilled") {
    return {
      error:
        "This order has already been paid/fulfilled and can no longer be canceled online. Please contact us directly.",
    };
  }

  if (order.status === "canceled") {
    return { error: "This order is already canceled." };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "canceled" })
    .eq("token", token);

  if (error) {
    return { error: error.message };
  }

  await sendCustomerCancellationEmail({
    to: order.email,
    customerName: order.customer_name,
  });

  await sendAdminCancellationEmail({
    customerName: order.customer_name,
    email: order.email,
    orderId: order.id,
  });

  revalidatePath(`/order/${token}`);
  return {};
}