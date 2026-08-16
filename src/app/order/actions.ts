"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "@/lib/email";

type OrderItemInput = { id: string; quantity: number };
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

const MAX_ITEMS = 50;
const MAX_QUANTITY = 100;
const MAX_TEXT = 2000;

function clean(value: string | undefined, max = MAX_TEXT) {
  return (value ?? "").trim().slice(0, max);
}

export async function createOrder(input: OrderInput): Promise<{ error?: string; token?: string }> {
  if (!input.items?.length || input.items.length > MAX_ITEMS) return { error: "Invalid cart." };
  if (!clean(input.customerName, 120) || !clean(input.email, 254)) return { error: "Name and email are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return { error: "Please provide a valid email address." };

  const requested = new Map<string, number>();
  for (const item of input.items) {
    if (!item.id || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY) return { error: "Invalid cart quantity." };
    requested.set(item.id, (requested.get(item.id) ?? 0) + item.quantity);
  }

  const supabase = createAdminClient();
  const ids = [...requested.keys()];
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, name, part_number, price, in_stock")
    .in("id", ids);

  if (productError || !products || products.length !== ids.length) return { error: "One or more products are no longer available." };

  const productById = new Map(products.map((product) => [product.id, product]));
  const itemRows = [] as { order_id: string; product_id: string; product_name: string; part_number: string; price: number; quantity: number }[];
  let total = 0;

  for (const [id, quantity] of requested) {
    const product = productById.get(id);
    if (!product || !product.in_stock) return { error: `${product?.name ?? "A product"} is no longer in stock.` };
    const price = Number(product.price);
    if (!Number.isFinite(price) || price < 0) return { error: "A product has an invalid price. Please contact us." };
    total += price * quantity;
    itemRows.push({ order_id: "", product_id: product.id, product_name: product.name, part_number: product.part_number, price, quantity });
  }

  const { data: order, error } = await supabase.from("orders").insert({
    customer_name: clean(input.customerName, 120),
    email: clean(input.email, 254).toLowerCase(),
    shipping_type: input.shippingType,
    shipping_address: clean(input.shippingAddress),
    payment_method: clean(input.paymentMethod, 100),
    payment_method_other: clean(input.paymentMethodOther, 500),
    note: clean(input.note),
  }).select().single();

  if (error || !order) return { error: "Unable to create your order. Please try again." };

  const rows = itemRows.map((row) => ({ ...row, order_id: order.id }));
  const { error: itemsError } = await supabase.from("order_items").insert(rows);
  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "Unable to save your order. Please try again." };
  }

  await sendOrderConfirmationEmail({ to: order.email, customerName: order.customer_name, token: order.token, total, orderNumber: order.order_number });
  await sendAdminNewOrderEmail({ customerName: order.customer_name, email: order.email, total, orderId: order.id });
  return { token: order.token };
}
