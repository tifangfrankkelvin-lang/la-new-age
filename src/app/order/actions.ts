"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "@/lib/email";

type OrderItemInput = {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  quantity: number;
};

type OrderInput = {
  customerName: string;
  email: string;
  shippingType: "shipping" | "pickup";
  shippingAddress?: string;
  paymentMethod: string;
  paymentMethodOther?: string;
  note?: string;
  items: OrderItemInput[];
};

export async function createOrder(
  input: OrderInput
): Promise<{ error?: string; token?: string }> {
  if (!input.items || input.items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      email: input.email,
      shipping_type: input.shippingType,
      shipping_address: input.shippingAddress || null,
      payment_method: input.paymentMethod,
      payment_method_other: input.paymentMethodOther || null,
      note: input.note || null,
    })
    .select()
    .single();

  if (error || !order) {
    return { error: error?.message ?? "Something went wrong. Please try again." };
  }

  const itemRows = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    part_number: item.partNumber,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemRows);

  if (itemsError) {
    return { error: itemsError.message };
  }

  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

await sendOrderConfirmationEmail({
    to: input.email,
    customerName: input.customerName,
    token: order.token,
    total,
    orderNumber: order.order_number,
  });

  await sendAdminNewOrderEmail({
    customerName: input.customerName,
    email: input.email,
    total,
    orderId: order.id,
  });

  return { token: order.token };
}