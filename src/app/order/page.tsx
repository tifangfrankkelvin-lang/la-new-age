"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "./actions";

const PAYMENT_METHODS = ["Zelle", "Apple Pay", "Cash App", "PayPal", "Crypto", "Other"];

export default function OrderPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [shippingType, setShippingType] = useState<"shipping" | "pickup">("shipping");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethodOther, setPaymentMethodOther] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl uppercase text-brand-navy mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-brand-mid text-sm mb-6">
          Add something to your cart before placing an order.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide px-6 py-3 hover:bg-brand-orange transition-colors"
        >
          Shop Parts
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (shippingType === "shipping" && !shippingAddress.trim()) {
      setError("Please enter a shipping address.");
      return;
    }
    if (!paymentMethod) {
      setError("Please choose a payment method.");
      return;
    }
    if (paymentMethod === "Other" && !paymentMethodOther.trim()) {
      setError("Please specify your payment method.");
      return;
    }

    setSubmitting(true);

    const result = await createOrder({
      customerName,
      email,
      shippingType,
      shippingAddress: shippingType === "shipping" ? shippingAddress : undefined,
      paymentMethod,
      paymentMethodOther: paymentMethod === "Other" ? paymentMethodOther : undefined,
      note,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        partNumber: i.partNumber,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    setSubmitting(false);

    if (result.error || !result.token) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    clearCart();
    router.push(`/order/${result.token}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl uppercase text-brand-navy mb-8">
        Place Your Order
      </h1>

      <div className="grid md:grid-cols-[1fr_260px] gap-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
              Full Name
            </label>
            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
            />
            <p className="text-xs text-brand-mid mt-1">
              We&apos;ll send payment instructions and your order link here.
            </p>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-2">
              Shipping or Pickup
            </label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-brand-steel">
                <input
                  type="radio"
                  checked={shippingType === "shipping"}
                  onChange={() => setShippingType("shipping")}
                />
                Ship to me
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-steel">
                <input
                  type="radio"
                  checked={shippingType === "pickup"}
                  onChange={() => setShippingType("pickup")}
                />
                Local pickup (LA)
              </label>
            </div>
            {shippingType === "shipping" && (
              <textarea
                required
                rows={2}
                placeholder="Street address, city, state, ZIP"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
              />
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-2">
              Preferred Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method}
                  className={`border text-sm px-3 py-2 cursor-pointer ${
                    paymentMethod === method
                      ? "border-brand-orange text-brand-orange"
                      : "border-brand-mid/30 text-brand-steel"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="mr-2"
                  />
                  {method}
                </label>
              ))}
            </div>
            {paymentMethod === "Other" && (
              <input
                required
                placeholder="Please specify"
                value={paymentMethodOther}
                onChange={(e) => setPaymentMethodOther(e.target.value)}
                className="mt-2 w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
              />
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
              Note (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Anything we should know about your order?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide py-3.5 hover:bg-brand-orange transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
        </form>

        {/* Order summary */}
        <div className="border border-brand-mid/20 p-4 h-fit">
          <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-3">
            Order Summary
          </h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-brand-steel">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-brand-navy">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-mid/20 pt-3 flex justify-between font-display text-lg">
            <span className="text-brand-navy">Total</span>
            <span className="text-brand-orange">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}