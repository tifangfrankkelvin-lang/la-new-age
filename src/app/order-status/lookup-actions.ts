"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function lookupOrderByNumber(
  orderNumber: string,
  email: string
): Promise<{ error?: string; token?: string }> {
  const parsedNumber = parseInt(orderNumber, 10);

  if (isNaN(parsedNumber)) {
    return { error: "Please enter a valid order number." };
  }

  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("token")
    .eq("order_number", parsedNumber)
    .eq("email", email)
    .single();

  if (!order) {
    return {
      error:
        "No order found matching that number and email. Double-check both, or use the email link option below.",
    };
  }

  return { token: order.token };
}